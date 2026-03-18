import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListLinksQueryDto {
  @ApiPropertyOptional({ example: '1', default: '1' })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ example: '20', default: '20' })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional({ example: 'PENDENTE,RESPONDIDO', description: 'Status separados por vírgula' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'cuid-da-ferramenta' })
  @IsOptional()
  @IsString()
  ferramentaId?: string;

  @ApiPropertyOptional({ example: 'João', description: 'Busca por nome do cliente ou token' })
  @IsOptional()
  @IsString()
  search?: string;
}
