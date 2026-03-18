import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { LinkService } from '../service/link.service';
import { CreateLinkDto } from '../dto/create-link.dto';
import { ListLinksQueryDto } from '../dto/list-links-query.dto';
import { ReenviarLinkDto } from '../dto/reenviar-link.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('links')
@Controller('links')
export class LinkController {
  constructor(private readonly service: LinkService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo link de pesquisa' })
  @ApiResponse({ status: 201, description: 'Link criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() dto: CreateLinkDto) {
    return this.service.create(dto);
  }

  @Get('metricas')
  @ApiOperation({ summary: 'Retorna métricas consolidadas para o dashboard' })
  @ApiQuery({ name: 'periodo', required: false, example: '7d' })
  @ApiResponse({ status: 200, description: 'Métricas retornadas.' })
  getMetricas(@Query('periodo') periodo?: string) {
    return this.service.getMetricas(periodo);
  }

  @Get('recentes')
  @ApiOperation({ summary: 'Lista links recentes para o gerador' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiResponse({ status: 200, description: 'Links recentes retornados.' })
  findRecentes(@Query('limit') limit?: string) {
    return this.service.findRecentes(Number(limit) || 10);
  }

  @Get()
  @ApiOperation({ summary: 'Lista links com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de links.' })
  findAll(@Query() query: ListLinksQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna o detalhe completo de um link' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Link encontrado.' })
  @ApiResponse({ status: 404, description: 'Link não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post(':id/reenviar')
  @ApiOperation({ summary: 'Reenvia o link pelo canal indicado' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Link reenviado.' })
  @ApiResponse({ status: 400, description: 'Link expirado ou já respondido.' })
  @ApiResponse({ status: 404, description: 'Link não encontrado.' })
  reenviar(@Param('id') id: string, @Body() dto: ReenviarLinkDto) {
    return this.service.reenviar(id, dto);
  }
}
