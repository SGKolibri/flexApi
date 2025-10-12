import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFormDto {
  @ApiProperty({ example: 'Maria Oliveira' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'maria@empresa.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+55 21 99876-5432' })
  @IsNotEmpty()
  @IsString()
  telefone: string;

  @ApiProperty({ example: 'Acme Ltda' })
  @IsNotEmpty()
  @IsString()
  nomeEmpresa: string;

  @ApiProperty({ example: 'Vender cursos online' })
  @IsNotEmpty()
  @IsString()
  siteObjetivo: string;

  @ApiProperty({ example: 'Profissionais de TI' })
  @IsNotEmpty()
  @IsString()
  publicoAlvo: string;

  @ApiProperty({ example: 'https://exemplo.com' })
  @IsNotEmpty()
  @IsString()
  siteReferencia: string;

  @ApiProperty({ example: 'Blog, Landing Page' })
  @IsNotEmpty()
  @IsString()
  tipoConteudo: string;

  @ApiPropertyOptional({ example: 'minhaempresa.com.br' })
  @IsOptional()
  @IsString()
  dominio?: string;

  @ApiPropertyOptional({ example: 'contato@empresa.com.br' })
  @IsOptional()
  @IsEmail()
  emailProfissional?: string;

  @ApiPropertyOptional({ example: 'Área de login, Pagamentos, Chat' })
  @IsOptional()
  @IsString()
  funcionalidades?: string;

  @ApiPropertyOptional({ example: 'Prazo até novembro' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
