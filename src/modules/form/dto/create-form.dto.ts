import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  telefone: string;

  @IsNotEmpty()
  @IsString()
  nomeEmpresa: string;

  @IsNotEmpty()
  @IsString()
  siteObjetivo: string;

  @IsNotEmpty()
  @IsString()
  publicoAlvo: string;

  @IsNotEmpty()
  @IsString()
  siteReferencia: string;

  @IsNotEmpty()
  @IsString()
  tipoConteudo: string;

  @IsOptional()
  @IsString()
  dominio?: string;

  @IsOptional()
  @IsEmail()
  emailProfissional?: string;

  @IsOptional()
  @IsString()
  funcionalidades?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
