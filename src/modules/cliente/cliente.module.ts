import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaClienteRepository } from './repository/prisma-cliente.repository';
import { ClienteService } from './service/cliente.service';
import { ClienteController } from './controller/cliente.controller';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService, PrismaClienteRepository, PrismaService],
  exports: [ClienteService],
})
export class ClienteModule {}
