import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClienteRepository } from '../repository/prisma-cliente.repository';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { ListClientesQueryDto } from '../dto/list-clientes-query.dto';

@Injectable()
export class ClienteService {
  constructor(private repo: PrismaClienteRepository) {}

  async create(dto: CreateClienteDto) {
    const exists = await this.repo.findByNome(dto.nome);
    if (exists) {
      throw new BadRequestException('Já existe um cliente com este nome');
    }
    return this.repo.create(dto);
  }

  async findAll(query: ListClientesQueryDto) {
    return this.repo.findAll(query);
  }

  async findOne(id: string) {
    const cliente = await this.repo.findById(id);
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  async update(id: string, dto: UpdateClienteDto) {
    const cliente = await this.repo.findById(id);
    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    if (dto.nome && dto.nome !== cliente.nome) {
      const exists = await this.repo.findByNome(dto.nome);
      if (exists) {
        throw new BadRequestException('Já existe um cliente com este nome');
      }
    }

    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    const cliente = await this.repo.findById(id);
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    await this.repo.deactivate(id);
    return { sucesso: true, mensagem: 'Cliente desativado com sucesso' };
  }
}
