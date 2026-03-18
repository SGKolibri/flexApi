import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { ClienteService } from '../service/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { ListClientesQueryDto } from '../dto/list-clientes-query.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Nome duplicado ou dados inválidos.' })
  create(@Body() dto: CreateClienteDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista clientes com filtros opcionais' })
  @ApiResponse({ status: 200, description: 'Lista de clientes.' })
  findAll(@Query() query: ListClientesQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um cliente pelo ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um cliente pelo ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Cliente atualizado.' })
  @ApiResponse({ status: 400, description: 'Nome duplicado ou dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclusão lógica do cliente (ativo = false)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Cliente desativado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
