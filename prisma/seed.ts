import { PrismaUserRepository } from '../src/modules/user/repository/prisma-user.repository';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import { UserRole } from '../src/modules/user/interfaces/user.interface';
import { hashPassword } from '../src/utils/password.util';
import { PrismaClienteRepository } from 'src/modules/cliente/repository/prisma-cliente.repository';
import { PrismaFerramentaRepository } from 'src/modules/ferramenta/repository/prisma-ferramenta.repository';
import { mockClientes } from 'src/modules/cliente/mock-clientes';
import { mockFerramentas } from 'src/modules/ferramenta/mock-ferramentas';
import { generateMockLinks } from 'src/modules/link/mock-links';

async function seedDatabase() {
  const prismaService = new PrismaService();
  const userRepository = new PrismaUserRepository(prismaService);
  const clienteRepository = new PrismaClienteRepository(prismaService);
  const ferramentaRepository = new PrismaFerramentaRepository(prismaService);
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';

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
    let tecnico = await userRepository.findByEmail(rootUser.email);
    if (tecnico) {
      console.log('Root user already exists');
    } else {
      tecnico = await userRepository.create(rootUser);
      console.log('Root user created successfully: ', tecnico.email);
    }

    // Seed Clientes
    const clientesSeeded: { id: string; nome: string }[] = [];
    for (const cliente of mockClientes) {
      let record = await clienteRepository.findByNome(cliente.nome);
      if (!record) {
        record = await clienteRepository.create({ ...cliente });
        console.log('Cliente criado:', cliente.nome);
      } else {
        console.log('Cliente já existe:', cliente.nome);
      }
      clientesSeeded.push({ id: record.id, nome: record.nome });
    }

    // Seed Ferramentas
    const ferramentasSeeded: { id: string; nome: string }[] = [];
    for (const ferramenta of mockFerramentas) {
      let record = await ferramentaRepository.findByNome(ferramenta.nome);
      if (!record) {
        record = await ferramentaRepository.create({ ...ferramenta });
        console.log('Ferramenta criada:', ferramenta.nome);
      } else {
        console.log('Ferramenta já existe:', ferramenta.nome);
      }
      ferramentasSeeded.push({ id: record.id, nome: record.nome });
    }

    // Seed Links
    const mockLinks = generateMockLinks(clientesSeeded, ferramentasSeeded, tecnico.id, baseUrl);
    for (const { link, resposta } of mockLinks) {
      const exists = await prismaService.link.findUnique({ where: { token: link.token } });
      if (exists) {
        console.log('Link já existe:', link.token.slice(0, 8) + '...');
        continue;
      }
      const created = await prismaService.link.create({ data: link });
      if (resposta) {
        await prismaService.$transaction([
          prismaService.resposta.create({ data: { linkId: created.id, ...resposta } }),
          prismaService.link.update({
            where: { id: created.id },
            data: { respondidoEm: link.respondidoEm ?? new Date() },
          }),
        ]);
      }
      console.log(
        `Link criado [${link.status}] ${clientesSeeded.find((c) => c.id === link.clienteId)?.nome} - ${ferramentasSeeded.find((f) => f.id === link.ferramentaId)?.nome} (${link.treinamentoNumero}/${link.treinamentoTotal})`,
      );
    }
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
