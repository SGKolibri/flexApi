import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaFerramentaRepository } from '../repository/prisma-ferramenta.repository';
import { CreateFerramentaDto } from '../dto/create-ferramenta.dto';
import { UpdateFerramentaDto } from '../dto/update-ferramenta.dto';
import { ListFerramentasQueryDto } from '../dto/list-ferramentas-query.dto';

@Injectable()
export class FerramentaService {
  constructor(private repo: PrismaFerramentaRepository) {}

  async create(dto: CreateFerramentaDto) {
    const exists = await this.repo.findByNome(dto.nome);
    if (exists) {
      throw new BadRequestException('Já existe uma ferramenta com este nome');
    }
    return this.repo.create(dto);
  }

  async findAll(query: ListFerramentasQueryDto) {
    return this.repo.findAll(query);
  }

  async findOne(id: string) {
    const ferramenta = await this.repo.findById(id);
    if (!ferramenta) throw new NotFoundException('Ferramenta não encontrada');
    return ferramenta;
  }

  async update(id: string, dto: UpdateFerramentaDto) {
    const ferramenta = await this.repo.findById(id);
    if (!ferramenta) throw new NotFoundException('Ferramenta não encontrada');

    if (dto.nome && dto.nome !== ferramenta.nome) {
      const exists = await this.repo.findByNome(dto.nome);
      if (exists) {
        throw new BadRequestException('Já existe uma ferramenta com este nome');
      }
    }

    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    const ferramenta = await this.repo.findById(id);
    if (!ferramenta) throw new NotFoundException('Ferramenta não encontrada');
    await this.repo.deactivate(id);
    return { sucesso: true, mensagem: 'Ferramenta desativada com sucesso' };
  }
}
