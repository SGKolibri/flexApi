import { PrismaUserRepository } from '../src/modules/user/repository/prisma-user.repository';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import { UserRole } from '../src/modules/user/interfaces/user.interface';
import { hashPassword } from '../src/utils/password.util';

async function seedDatabase() {
  const prismaService = new PrismaService();
  const userRepository = new PrismaUserRepository(prismaService);

  const rootPassword = process.env.ROOT_PASSWORD;
  if (!rootPassword) {
    throw new Error('ROOT_PASSWORD environment variable is required');
  }

  const rootUser: CreateUserDto = {
    nome: 'Samuel Custódio',
    email: process.env.ROOT_EMAIL || 'samuelcustodioes@gmail.com',
    senha: await hashPassword(rootPassword),
    telefone: '+55 62 91234-5678',
    cpf: '12345678901',
    role: UserRole.ADMIN,
  };

  try {
    const existingUser = await userRepository.findByEmail(rootUser.email);
    if (existingUser) {
      console.log('Root user already exists');
      return;
    }
    const createdUser = await userRepository.create(rootUser);
    console.log('Root user created successfully: ', createdUser.email);
  } catch (error) {
    console.error('Error seeding database: ', error);
    throw error;
  } finally {
    await prismaService.$disconnect();
  }
}

seedDatabase().catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});
