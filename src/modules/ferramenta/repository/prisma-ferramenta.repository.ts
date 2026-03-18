import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateFerramentaDto } from '../dto/create-ferramenta.dto';
import { UpdateFerramentaDto } from '../dto/update-ferramenta.dto';
import { ListFerramentasQueryDto } from '../dto/list-ferramentas-query.dto';

@Injectable()
export class PrismaFerramentaRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFerramentaDto) {
    return this.prisma.ferramenta.create({ data });
  }

  async findAll(query: ListFerramentasQueryDto) {
    const where: any = {};

    if (query.nome) {
      where.nome = { contains: query.nome, mode: 'insensitive' };
    }

    if (query.ativo !== undefined) {
      where.ativo = query.ativo === 'true';
    }

    return this.prisma.ferramenta.findMany({
      where,
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.ferramenta.findUnique({ where: { id } });
  }

  async findByNome(nome: string) {
    return this.prisma.ferramenta.findUnique({ where: { nome } });
  }

  async update(id: string, data: UpdateFerramentaDto) {
    return this.prisma.ferramenta.update({ where: { id }, data });
  }

  async deactivate(id: string) {
    return this.prisma.ferramenta.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
