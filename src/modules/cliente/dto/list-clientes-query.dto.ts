import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListClientesQueryDto {
  @ApiPropertyOptional({ example: 'Empresa' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 'true', description: '"true" | "false" | omitido (todos)' })
  @IsOptional()
  @IsString()
  ativo?: string;

  @ApiPropertyOptional({ example: '12345678000195' })
  @IsOptional()
  @IsString()
  documento?: string;
}
