import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaLinkRepository } from '../repository/prisma-link.repository';
import { CreateLinkDto } from '../dto/create-link.dto';
import { ListLinksQueryDto } from '../dto/list-links-query.dto';
import { ReenviarLinkDto } from '../dto/reenviar-link.dto';
import { ResponderLinkDto } from '../dto/responder-link.dto';
import { LinkStatus, MotivoInvalido } from '../interfaces/link.interface';

const NOTA_MAP: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Péssimo', emoji: '😡' },
  2: { label: 'Ruim', emoji: '😞' },
  3: { label: 'Regular', emoji: '😐' },
  4: { label: 'Bom', emoji: '😊' },
  5: { label: 'Excelente', emoji: '🤩' },
};

@Injectable()
export class LinkService {
  constructor(private repo: PrismaLinkRepository) {}

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private buildUrl(token: string): string {
    const base = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${base}/pesquisa/${token}`;
  }

  private parsePeriodo(periodo: string): Date {
    const match = periodo.match(/^(\d+)d$/);
    const dias = match ? parseInt(match[1], 10) : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dias);
    return startDate;
  }

  async create(dto: CreateLinkDto) {
    const token = this.generateToken();
    const url = this.buildUrl(token);
    const expiradoEm = new Date();
    expiradoEm.setHours(expiradoEm.getHours() + dto.validadeHoras);

    try {
      return await this.repo.create({
        token,
        url,
        clienteId: dto.clienteId,
        ferramentaId: dto.ferramentaId,
        tecnicoId: dto.tecnicoId,
        treinamentoNumero: dto.treinamentoNumero,
        treinamentoTotal: dto.treinamentoTotal,
        validadeHoras: dto.validadeHoras,
        expiradoEm,
      });
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw new BadRequestException(
          'clienteId, ferramentaId ou tecnicoId inválido',
        );
      }
      throw e;
    }
  }

  async findAll(query: ListLinksQueryDto) {
    return this.repo.findAll(query);
  }

  async findById(id: string) {
    const link = await this.repo.findById(id);
    if (!link) throw new NotFoundException('Link não encontrado');

    if (link.status === LinkStatus.PENDENTE && new Date() > link.expiradoEm) {
      await this.repo.updateStatus(id, LinkStatus.EXPIRADO);
      link.status = LinkStatus.EXPIRADO;
    }

    return link;
  }

  async findRecentes(limit: number) {
    return this.repo.findRecentes(Math.max(1, limit || 10));
  }

  async reenviar(id: string, dto: ReenviarLinkDto) {
    const link = await this.repo.findById(id);
    if (!link) throw new NotFoundException('Link não encontrado');

    if (link.status === LinkStatus.RESPONDIDO) {
      throw new BadRequestException('Link já foi respondido');
    }

    if (link.status === LinkStatus.EXPIRADO || new Date() > link.expiradoEm) {
      throw new BadRequestException('Link expirado não pode ser reenviado');
    }

    const updated = await this.repo.reenviar(id, dto.canal);
    return {
      sucesso: true,
      id: updated.id,
      enviadoEm: updated.enviadoEm,
      canalEnvio: updated.canalEnvio,
    };
  }

  async getMetricas(periodo = '7d') {
    const startDate = this.parsePeriodo(periodo);
    const links = await this.repo.getMetricasData(startDate);

    const respondidas = links.filter(
      (l) => l.status === LinkStatus.RESPONDIDO,
    ).length;
    const expiradas = links.filter(
      (l) => l.status === LinkStatus.EXPIRADO,
    ).length;
    const pendentes = links.filter(
      (l) => l.status === LinkStatus.PENDENTE,
    ).length;
    const linksEnviados = links.length;

    const taxaResposta =
      linksEnviados > 0
        ? Math.round((respondidas / linksEnviados) * 10000) / 100
        : 0;

    const notas = links
      .filter((l) => l.resposta)
      .map((l) => l.resposta!.nota);
    const pontuacaoMedia =
      notas.length > 0
        ? Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 100) /
          100
        : 0;

    const serieMap = new Map<string, number>();
    for (const link of links) {
      if (link.respondidoEm) {
        const dia = link.respondidoEm.toISOString().split('T')[0];
        serieMap.set(dia, (serieMap.get(dia) || 0) + 1);
      }
    }
    const serieRespostasPorDia = Array.from(serieMap.entries())
      .map(([dia, quantidade]) => ({ dia, quantidade }))
      .sort((a, b) => a.dia.localeCompare(b.dia));

    return {
      taxaResposta,
      pontuacaoMedia,
      linksEnviados,
      pendentes,
      respondidas,
      expiradas,
      serieRespostasPorDia,
    };
  }

  async getPublicLink(token: string) {
    const link = await this.repo.findByToken(token);

    if (!link) {
      return { valido: false, motivoInvalido: MotivoInvalido.NAO_ENCONTRADO };
    }

    if (!link.primeiroAcessoEm) {
      await this.repo.setPrimeiroAcesso(link.id);
    }

    if (link.status === LinkStatus.RESPONDIDO) {
      return { valido: false, motivoInvalido: MotivoInvalido.JA_RESPONDIDO };
    }

    if (link.status === LinkStatus.EXPIRADO || new Date() > link.expiradoEm) {
      if (link.status !== LinkStatus.EXPIRADO) {
        await this.repo.updateStatus(link.id, LinkStatus.EXPIRADO);
      }
      return { valido: false, motivoInvalido: MotivoInvalido.EXPIRADO };
    }

    return {
      valido: true,
      clienteNome: link.cliente.nome,
      ferramentaNome: link.ferramenta.nome,
      treinamentoNumero: link.treinamentoNumero,
      treinamentoTotal: link.treinamentoTotal,
      tecnicoNome: link.tecnico.nome,
    };
  }

  async responder(token: string, dto: ResponderLinkDto) {
    const link = await this.repo.findByToken(token);

    if (!link) throw new NotFoundException('Token não encontrado');

    if (link.status === LinkStatus.RESPONDIDO || link.resposta) {
      throw new ConflictException('Este link já foi respondido');
    }

    if (link.status === LinkStatus.EXPIRADO || new Date() > link.expiradoEm) {
      throw new GoneException('Este link está expirado');
    }

    const { label, emoji } = NOTA_MAP[dto.nota];

    await this.repo.createResposta(link.id, {
      nota: dto.nota,
      label,
      emoji,
      comentario: dto.comentario,
    });

    return {
      sucesso: true,
      mensagem: 'Obrigado pelo seu feedback!',
      respondidoEm: new Date(),
    };
  }
}
