import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        senha: { type: 'string', example: 'senha123' },
      },
    },
  })
  async login(@Body() loginDto: { email: string; senha: string }) {
    return this.authService.login(loginDto.email, loginDto.senha);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Nome do Usuário' },
        email: { type: 'string', example: 'user@example.com' },
        senha: { type: 'string', example: 'senha123' },
        telefone: { type: 'string', example: '+55 62 91234-5678' },
        cpf: { type: 'string', example: '12345678901' },
      },
    },
  })
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }
}
