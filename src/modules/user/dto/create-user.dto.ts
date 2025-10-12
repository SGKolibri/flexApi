import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../interfaces/user.interface';

export class CreateUserDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ minLength: 6 })
  @IsOptional()
  @IsString()
  senha?: string;

  @ApiProperty({ example: '+55 11 91234-5678' })
  @IsNotEmpty()
  @IsString()
  telefone: string;

  @ApiProperty({ example: '12345678901', description: '11 dígitos' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'cpf deve ter 11 dígitos numéricos sem pontos',
  })
  cpf: string;
}
