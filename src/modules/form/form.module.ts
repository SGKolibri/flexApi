import { Module } from '@nestjs/common';
import { FormController } from './controller/form.controller';
import { FormService } from './service/form.service';
import { PrismaFormRepository } from './repository/prisma-form.interface';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from 'src/shared/services/email/email.service';
import { UserService } from '../user/service/user.service';
import { PrismaUserRepository } from '../user/repository/prisma-user.repository';

@Module({
  imports: [ConfigModule],
  controllers: [FormController],
  providers: [
    FormService,
    PrismaFormRepository,
    PrismaService,
    EmailService,
    UserService,
    PrismaUserRepository,
  ],
})
export class FormModule {}
