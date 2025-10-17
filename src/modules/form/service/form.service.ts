import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaFormRepository } from '../repository/prisma-form.interface';
import { CreateFormDto } from '../dto/create-form.dto';
import { UpdateFormDto } from '../dto/update-form.dto';
import { EmailService } from 'src/shared/services/email/email.service';
import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class FormService {
  constructor(
    private formRepo: PrismaFormRepository,
    private emailService: EmailService,
    private userService: UserService,
  ) {}

  async create(dto: CreateFormDto) {
    try {
      const form = await this.formRepo.create(dto);

      const adminEmails = await this.userService.getAdminEmails();

      if (adminEmails.length > 0) {
        await this.emailService.sendNewFormNotification(form, adminEmails);
        console.log(`Email enviado para ${adminEmails.length} administradores`);
      } else {
        console.warn('Nenhum administrador encontrado para enviar notificação');
      }

      return form;
    } catch (error) {
      console.error('Erro ao criar formulário:', error);
      throw error;
    }
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
