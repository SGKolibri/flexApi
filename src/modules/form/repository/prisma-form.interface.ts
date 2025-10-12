import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IFormRepository } from '../interfaces/form.interface';
import { Form } from '@prisma/client';
import { CreateFormDto } from '../dto/create-form.dto';
import { UpdateFormDto } from '../dto/update-form.dto';

@Injectable()
export class PrismaFormRepository implements IFormRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFormDto): Promise<Form> {
    return this.prisma.form.create({ data });
  }

  async findAll(): Promise<Form[]> {
    return this.prisma.form.findMany();
  }

  async findById(id: string): Promise<Form | null> {
    return this.prisma.form.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Form | null> {
    return this.prisma.form.findUnique({ where: { email } });
  }

  async update(id: string, data: UpdateFormDto): Promise<Form> {
    return this.prisma.form.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Form> {
    return this.prisma.form.delete({ where: { id } });
  }
}
