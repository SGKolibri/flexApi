import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { LinkStatus } from '../interfaces/link.interface';
import { ListLinksQueryDto } from '../dto/list-links-query.dto';

const linkWithRelations = {
  cliente: { select: { id: true, nome: true } },
  ferramenta: { select: { id: true, nome: true } },
  tecnico: { select: { id: true, nome: true } },
  resposta: true,
};

@Injectable()
export class PrismaLinkRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    token: string;
    url: string;
    clienteId: string;
    ferramentaId: string;
    tecnicoId: string;
    treinamentoNumero: number;
    treinamentoTotal: number;
    validadeHoras: number;
    expiradoEm: Date;
  }) {
    return this.prisma.link.create({
      data,
      include: linkWithRelations,
    });
  }

  async findAll(query: ListLinksQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const skip = (page - 1) * limit;

    const statusFilter = query.status
      ? (query.status.split(',').map((s) => s.trim()) as LinkStatus[])
      : undefined;

    const where: any = {};

    if (statusFilter) {
      where.status = { in: statusFilter };
    }

    if (query.ferramentaId) {
      where.ferramentaId = query.ferramentaId;
    }

    if (query.search) {
      where.OR = [
        { token: { contains: query.search, mode: 'insensitive' } },
        { cliente: { nome: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [total, links] = await Promise.all([
      this.prisma.link.count({ where }),
      this.prisma.link.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: linkWithRelations,
      }),
    ]);

    const data = links.map((link) => ({
      id: link.id,
      clienteNome: link.cliente.nome,
      ferramentaNome: link.ferramenta.nome,
      treinamentoNumero: link.treinamentoNumero,
      treinamentoTotal: link.treinamentoTotal,
      tecnicoNome: link.tecnico.nome,
      status: link.status,
      createdAt: link.createdAt,
      respondidoEm: link.respondidoEm,
      nota: link.resposta?.nota ?? null,
      emoji: link.resposta?.emoji ?? null,
      label: link.resposta?.label ?? null,
      comentario: link.resposta?.comentario ?? null,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return this.prisma.link.findUnique({
      where: { id },
      include: linkWithRelations,
    });
  }

  async findRecentes(limit: number) {
    const links = await this.prisma.link.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        cliente: { select: { id: true, nome: true } },
        ferramenta: { select: { id: true, nome: true } },
      },
    });

    return links.map((link) => ({
      id: link.id,
      clienteNome: link.cliente.nome,
      ferramentaNome: link.ferramenta.nome,
      url: link.url,
      createdAt: link.createdAt,
    }));
  }

  async findByToken(token: string) {
    return this.prisma.link.findUnique({
      where: { token },
      include: linkWithRelations,
    });
  }

  async updateStatus(id: string, status: LinkStatus) {
    return this.prisma.link.update({
      where: { id },
      data: { status },
    });
  }

  async setPrimeiroAcesso(id: string) {
    return this.prisma.link.update({
      where: { id },
      data: { primeiroAcessoEm: new Date() },
    });
  }

  async reenviar(id: string, canal?: string) {
    return this.prisma.link.update({
      where: { id },
      data: {
        enviadoEm: new Date(),
        ...(canal ? { canalEnvio: canal as any } : {}),
      },
    });
  }

  async createResposta(
    linkId: string,
    data: { nota: number; label: string; emoji: string; comentario?: string },
  ) {
    const [resposta] = await this.prisma.$transaction([
      this.prisma.resposta.create({ data: { linkId, ...data } }),
      this.prisma.link.update({
        where: { id: linkId },
        data: {
          status: LinkStatus.RESPONDIDO,
          respondidoEm: new Date(),
        },
      }),
    ]);
    return resposta;
  }

  async getMetricasData(startDate: Date) {
    const links = await this.prisma.link.findMany({
      where: { createdAt: { gte: startDate } },
      include: { resposta: true },
    });
    return links;
  }
}
