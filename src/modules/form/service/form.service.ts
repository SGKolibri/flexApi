import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaFormRepository } from '../repository/prisma-form.interface';
import { CreateFormDto } from '../dto/create-form.dto';
import { UpdateFormDto } from '../dto/update-form.dto';

@Injectable()
export class FormService {
  constructor(private formRepo: PrismaFormRepository) {}

  async create(data: CreateFormDto) {
    const exists = await this.formRepo.findByEmail(data.email);
    if (exists)
      throw new BadRequestException('Email já cadastrado para formulário');
    return this.formRepo.create(data);
  }

  async findAll() {
    return this.formRepo.findAll();
  }

  async findOne(id: string) {
    const form = await this.formRepo.findById(id);
    if (!form) throw new NotFoundException('Form não encontrado');
    return form;
  }

  async update(id: string, data: UpdateFormDto) {
    const form = await this.formRepo.findById(id);
    if (!form) throw new NotFoundException('Form não encontrado');
    return this.formRepo.update(id, data);
  }

  async remove(id: string) {
    const form = await this.formRepo.findById(id);
    if (!form) throw new NotFoundException('Form não encontrado');
    return this.formRepo.delete(id);
  }
}
