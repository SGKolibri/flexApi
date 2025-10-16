import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<User>;
  isAdmin(id: string): Promise<boolean>;
}
