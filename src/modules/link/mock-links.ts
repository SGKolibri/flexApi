import { randomBytes } from 'crypto';
import { CanalEnvio, LinkStatus } from './interfaces/link.interface';

type ClienteRef = { id: string; nome: string };
type FerramentaRef = { id: string; nome: string };

type MockLinkRaw = {
  token: string;
  url: string;
  clienteId: string;
  ferramentaId: string;
  tecnicoId: string;
  treinamentoNumero: number;
  treinamentoTotal: number;
  validadeHoras: number;
  expiradoEm: Date;
  status: LinkStatus;
  canalEnvio?: CanalEnvio;
  enviadoEm?: Date;
  primeiroAcessoEm?: Date;
  respondidoEm?: Date;
  observacaoInterna?: string;
};

type MockResposta = {
  nota: number;
  label: string;
  emoji: string;
  comentario?: string;
};

export type MockLinkEntry = {
  link: MockLinkRaw;
  resposta?: MockResposta;
};

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

const respostas: MockResposta[] = [
  { nota: 5, label: 'Excelente', emoji: '😄', comentario: 'Treinamento muito claro e objetivo.' },
  { nota: 4, label: 'Bom', emoji: '🙂', comentario: 'Ficou bem explicado, só faltou um pouco mais de tempo.' },
  { nota: 3, label: 'Regular', emoji: '😐', comentario: 'Poderia ter mais exemplos práticos.' },
  { nota: 5, label: 'Excelente', emoji: '😄' },
  { nota: 4, label: 'Bom', emoji: '🙂', comentario: 'Ótimo atendimento do técnico.' },
  { nota: 2, label: 'Ruim', emoji: '😕', comentario: 'Tive dificuldade de acessar o sistema durante o treinamento.' },
  { nota: 5, label: 'Excelente', emoji: '😄', comentario: 'Super satisfeita com o suporte recebido!' },
];

export function generateMockLinks(
  clientes: ClienteRef[],
  ferramentas: FerramentaRef[],
  tecnicoId: string,
  baseUrl: string,
): MockLinkEntry[] {
  const token = () => randomBytes(32).toString('hex');
  const url = (t: string) => `${baseUrl}/pesquisa/${t}`;
  const c = (i: number) => clientes[i % clientes.length];
  const f = (i: number) => ferramentas[i % ferramentas.length];

  const entries: MockLinkEntry[] = [
    // ── PENDENTES ──────────────────────────────────────────────────────────────
    {
      link: {
        token: token(), url: '', clienteId: c(0).id, ferramentaId: f(0).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 3, validadeHoras: 72,
        expiradoEm: daysFromNow(3), status: LinkStatus.PENDENTE,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(1),
        observacaoInterna: 'Aguardando retorno do cliente.',
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(1).id, ferramentaId: f(1).id, tecnicoId,
        treinamentoNumero: 2, treinamentoTotal: 3, validadeHoras: 48,
        expiradoEm: daysFromNow(2), status: LinkStatus.PENDENTE,
        canalEnvio: CanalEnvio.EMAIL, enviadoEm: daysAgo(0),
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(2).id, ferramentaId: f(2).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 1, validadeHoras: 24,
        expiradoEm: daysFromNow(1), status: LinkStatus.PENDENTE,
        canalEnvio: CanalEnvio.MANUAL,
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(3).id, ferramentaId: f(3).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 2, validadeHoras: 48,
        expiradoEm: daysFromNow(2), status: LinkStatus.PENDENTE,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(1),
        primeiroAcessoEm: daysAgo(0),
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(4).id, ferramentaId: f(4).id, tecnicoId,
        treinamentoNumero: 3, treinamentoTotal: 3, validadeHoras: 72,
        expiradoEm: daysFromNow(4), status: LinkStatus.PENDENTE,
      },
    },

    // ── RESPONDIDOS ────────────────────────────────────────────────────────────
    {
      link: {
        token: token(), url: '', clienteId: c(0).id, ferramentaId: f(5).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 1, validadeHoras: 48,
        expiradoEm: daysAgo(-5), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(8),
        primeiroAcessoEm: daysAgo(7), respondidoEm: daysAgo(7),
      },
      resposta: respostas[0],
    },
    {
      link: {
        token: token(), url: '', clienteId: c(1).id, ferramentaId: f(6).id, tecnicoId,
        treinamentoNumero: 2, treinamentoTotal: 2, validadeHoras: 24,
        expiradoEm: daysAgo(-3), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.EMAIL, enviadoEm: daysAgo(5),
        primeiroAcessoEm: daysAgo(4), respondidoEm: daysAgo(4),
      },
      resposta: respostas[1],
    },
    {
      link: {
        token: token(), url: '', clienteId: c(2).id, ferramentaId: f(0).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 3, validadeHoras: 72,
        expiradoEm: daysAgo(-10), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(14),
        primeiroAcessoEm: daysAgo(13), respondidoEm: daysAgo(13),
        observacaoInterna: 'Primeiro treinamento concluído com sucesso.',
      },
      resposta: respostas[2],
    },
    {
      link: {
        token: token(), url: '', clienteId: c(3).id, ferramentaId: f(7).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 2, validadeHoras: 48,
        expiradoEm: daysAgo(-6), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.MANUAL, enviadoEm: daysAgo(9),
        primeiroAcessoEm: daysAgo(8), respondidoEm: daysAgo(8),
      },
      resposta: respostas[3],
    },
    {
      link: {
        token: token(), url: '', clienteId: c(4).id, ferramentaId: f(8).id, tecnicoId,
        treinamentoNumero: 3, treinamentoTotal: 3, validadeHoras: 24,
        expiradoEm: daysAgo(-2), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.EMAIL, enviadoEm: daysAgo(4),
        primeiroAcessoEm: daysAgo(3), respondidoEm: daysAgo(3),
      },
      resposta: respostas[4],
    },
    {
      link: {
        token: token(), url: '', clienteId: c(0).id, ferramentaId: f(2).id, tecnicoId,
        treinamentoNumero: 2, treinamentoTotal: 3, validadeHoras: 48,
        expiradoEm: daysAgo(-15), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(20),
        primeiroAcessoEm: daysAgo(19), respondidoEm: daysAgo(19),
      },
      resposta: respostas[5],
    },
    {
      link: {
        token: token(), url: '', clienteId: c(2).id, ferramentaId: f(4).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 2, validadeHoras: 72,
        expiradoEm: daysAgo(-30), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.EMAIL, enviadoEm: daysAgo(35),
        primeiroAcessoEm: daysAgo(34), respondidoEm: daysAgo(34),
        observacaoInterna: 'Cliente muito satisfeita.',
      },
      resposta: respostas[6],
    },
    {
      link: {
        token: token(), url: '', clienteId: c(0).id, ferramentaId: f(6).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 2, validadeHoras: 48,
        expiradoEm: daysAgo(5), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(10),
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(2).id, ferramentaId: f(7).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 1, validadeHoras: 24,
        expiradoEm: daysAgo(1), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.EMAIL, enviadoEm: daysAgo(3),
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(4).id, ferramentaId: f(8).id, tecnicoId,
        treinamentoNumero: 2, treinamentoTotal: 3, validadeHoras: 72,
        expiradoEm: daysAgo(-1), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.MANUAL, enviadoEm: daysAgo(2),
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(1).id, ferramentaId: f(3).id, tecnicoId,
        treinamentoNumero: 2, treinamentoTotal: 2, validadeHoras: 24,
        expiradoEm: daysAgo(-3), status: LinkStatus.RESPONDIDO,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(4),
        primeiroAcessoEm: daysAgo(4),
      },
    },
    // ── EXPIRADOS ──────────────────────────────────────────────────────────────
    {
      link: {
        token: token(), url: '', clienteId: c(1).id, ferramentaId: f(3).id, tecnicoId,
        treinamentoNumero: 2, treinamentoTotal: 2, validadeHoras: 24,
        expiradoEm: daysAgo(3), status: LinkStatus.EXPIRADO,
        canalEnvio: CanalEnvio.WHATSAPP, enviadoEm: daysAgo(4),
        primeiroAcessoEm: daysAgo(4),
        observacaoInterna: 'Cliente não respondeu dentro do prazo.',
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(3).id, ferramentaId: f(1).id, tecnicoId,
        treinamentoNumero: 1, treinamentoTotal: 1, validadeHoras: 48,
        expiradoEm: daysAgo(7), status: LinkStatus.EXPIRADO,
        canalEnvio: CanalEnvio.EMAIL, enviadoEm: daysAgo(9),
      },
    },
    {
      link: {
        token: token(), url: '', clienteId: c(4).id, ferramentaId: f(5).id, tecnicoId,
        treinamentoNumero: 3, treinamentoTotal: 3, validadeHoras: 72,
        expiradoEm: daysAgo(2), status: LinkStatus.EXPIRADO,
        canalEnvio: CanalEnvio.MANUAL, enviadoEm: daysAgo(5),
        primeiroAcessoEm: daysAgo(4),
      },
    },
  ];

  // Preenche a URL com o token gerado
  for (const entry of entries) {
    entry.link.url = url(entry.link.token);
  }

  return entries;
}
