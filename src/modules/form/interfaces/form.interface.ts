import { Form } from '@prisma/client';
import { CreateFormDto } from '../dto/create-form.dto';
import { UpdateFormDto } from '../dto/update-form.dto';

export interface IFormRepository {
  create(data: CreateFormDto): Promise<Form>;
  findAll(): Promise<Form[]>;
  findById(id: string): Promise<Form | null>;
  findByEmail(email: string): Promise<Form | null>;
  update(id: string, data: UpdateFormDto): Promise<Form>;
  delete(id: string): Promise<Form>;
}
