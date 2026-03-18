import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { ListClientesQueryDto } from '../dto/list-clientes-query.dto';

@Injectable()
export class PrismaClienteRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return this.prisma.cliente.create({ data });
  }

  async findAll(query: ListClientesQueryDto) {
    const where: any = {};

    if (query.nome) {
      where.nome = { contains: query.nome, mode: 'insensitive' };
    }

    if (query.ativo !== undefined) {
      where.ativo = query.ativo === 'true';
    }

    if (query.documento) {
      where.documento = { contains: query.documento };
    }

    return this.prisma.cliente.findMany({
      where,
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.cliente.findUnique({ where: { id } });
  }

  async findByNome(nome: string) {
    return this.prisma.cliente.findUnique({ where: { nome } });
  }

  async update(id: string, data: UpdateClienteDto) {
    return this.prisma.cliente.update({ where: { id }, data });
  }

  async deactivate(id: string) {
    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
