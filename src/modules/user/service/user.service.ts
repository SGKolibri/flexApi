import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaUserRepository } from '../repository/prisma-user.repository';
import { hashPassword } from '../../../utils/password.util';
import { UserRole } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: PrismaUserRepository) {}

  async create(data: CreateUserDto) {
    if (data.role === UserRole.ADMIN && !data.senha) {
      throw new BadRequestException(
        'Senha é obrigatória para usuários com role ADMIN',
      );
    }

    if (typeof data.senha === 'string' && data.senha.length > 0) {
      data.senha = await hashPassword(data.senha);
    }

    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new BadRequestException('Email já cadastrado');

    return this.userRepo.create(data);
  }

  async findAll() {
    return this.userRepo.findAll();
  }

  async findOne(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (data.role === UserRole.ADMIN && !data.senha && !user.senha) {
      throw new BadRequestException(
        'Senha é obrigatória para usuários com role ADMIN',
      );
    }

    if (data.senha) {
      data.senha = await hashPassword(data.senha);
    }

    return this.userRepo.update(id, data);
  }

  async remove(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.userRepo.delete(id);
  }
}
