import { Module } from '@nestjs/common';
import { FormController } from './controller/form.controller';
import { FormService } from './service/form.service';
import { PrismaFormRepository } from './repository/prisma-form.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [FormController],
  providers: [FormService, PrismaFormRepository, PrismaService],
})
export class FormModule {}
