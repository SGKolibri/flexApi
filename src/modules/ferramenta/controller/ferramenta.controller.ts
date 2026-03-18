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
import { FerramentaService } from '../service/ferramenta.service';
import { CreateFerramentaDto } from '../dto/create-ferramenta.dto';
import { UpdateFerramentaDto } from '../dto/update-ferramenta.dto';
import { ListFerramentasQueryDto } from '../dto/list-ferramentas-query.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('ferramentas')
@Controller('ferramentas')
export class FerramentaController {
  constructor(private readonly service: FerramentaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova ferramenta' })
  @ApiResponse({ status: 201, description: 'Ferramenta criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Nome duplicado ou dados inválidos.' })
  create(@Body() dto: CreateFerramentaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista ferramentas com filtros opcionais' })
  @ApiResponse({ status: 200, description: 'Lista de ferramentas.' })
  findAll(@Query() query: ListFerramentasQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma ferramenta pelo ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Ferramenta encontrada.' })
  @ApiResponse({ status: 404, description: 'Ferramenta não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma ferramenta pelo ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Ferramenta atualizada.' })
  @ApiResponse({ status: 400, description: 'Nome duplicado ou dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Ferramenta não encontrada.' })
  update(@Param('id') id: string, @Body() dto: UpdateFerramentaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclusão lógica da ferramenta (ativo = false)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Ferramenta desativada.' })
  @ApiResponse({ status: 404, description: 'Ferramenta não encontrada.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
