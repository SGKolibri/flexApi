import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaFerramentaRepository } from './repository/prisma-ferramenta.repository';
import { FerramentaService } from './service/ferramenta.service';
import { FerramentaController } from './controller/ferramenta.controller';

@Module({
  controllers: [FerramentaController],
  providers: [FerramentaService, PrismaFerramentaRepository, PrismaService],
  exports: [FerramentaService],
})
export class FerramentaModule {}
