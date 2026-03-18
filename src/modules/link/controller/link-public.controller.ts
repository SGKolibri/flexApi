import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LinkService } from '../service/link.service';
import { ResponderLinkDto } from '../dto/responder-link.dto';

@ApiTags('links-publico')
@Controller('public/links')
export class LinkPublicController {
  constructor(private readonly service: LinkService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Consulta pública de pesquisa por token' })
  @ApiParam({ name: 'token', type: String })
  @ApiResponse({ status: 200, description: 'Dados da pesquisa ou motivo de invalidade.' })
  getByToken(@Param('token') token: string) {
    return this.service.getPublicLink(token);
  }

  @Post(':token/responder')
  @HttpCode(201)
  @ApiOperation({ summary: 'Envia a resposta de uma pesquisa pública' })
  @ApiParam({ name: 'token', type: String })
  @ApiResponse({ status: 201, description: 'Resposta registrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Payload inválido.' })
  @ApiResponse({ status: 404, description: 'Token não encontrado.' })
  @ApiResponse({ status: 409, description: 'Pesquisa já respondida.' })
  @ApiResponse({ status: 410, description: 'Link expirado.' })
  responder(@Param('token') token: string, @Body() dto: ResponderLinkDto) {
    return this.service.responder(token, dto);
  }
}
