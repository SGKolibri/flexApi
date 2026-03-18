import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaLinkRepository } from './repository/prisma-link.repository';
import { LinkService } from './service/link.service';
import { LinkController } from './controller/link.controller';
import { LinkPublicController } from './controller/link-public.controller';

@Module({
  controllers: [LinkController, LinkPublicController],
  providers: [LinkService, PrismaLinkRepository, PrismaService],
  exports: [LinkService],
})
export class LinkModule {}
