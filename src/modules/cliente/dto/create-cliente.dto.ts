import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Empresa Exemplo Ltda' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: '12345678000195', description: 'CNPJ (14 dígitos numéricos)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'documento deve conter 14 dígitos numéricos (CNPJ sem formatação)' })
  documento?: string;

  @ApiPropertyOptional({ example: 'João da Silva' })
  @IsOptional()
  @IsString()
  contato?: string;

  @ApiPropertyOptional({ example: 'contato@empresa.com' })
  @IsOptional()
  @IsEmail({}, { message: 'email inválido' })
  email?: string;

  @ApiPropertyOptional({ example: 'Observação interna sobre o cliente' })
  @IsOptional()
  @IsString()
  observacaoInterna?: string;
}
