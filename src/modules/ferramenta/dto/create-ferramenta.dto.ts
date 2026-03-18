import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFerramentaDto {
  @ApiProperty({ example: 'Treinamento de Vendas' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: 'Ferramenta voltada para capacitação de vendas' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ example: 'Uso interno apenas para clientes enterprise' })
  @IsOptional()
  @IsString()
  observacaoInterna?: string;
}
