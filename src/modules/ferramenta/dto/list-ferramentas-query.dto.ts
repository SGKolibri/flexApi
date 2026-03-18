import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListFerramentasQueryDto {
  @ApiPropertyOptional({ example: 'Vendas' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 'true', description: '"true" | "false" | omitido (todos)' })
  @IsOptional()
  @IsString()
  ativo?: string;
}
