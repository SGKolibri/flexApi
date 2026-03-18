# Especificacao Tecnica - Modulo de Link (Backend)

## Objetivo
Substituir os mocks do frontend por APIs reais para:

- Geracao de links de pesquisa
- Rastreio/listagem de links e status
- Recebimento de resposta publica por token
- Metricas consolidadas para dashboard e relatorios

Este documento descreve model, relacoes, enums, regras de negocio, endpoints e detalhes tecnicos.

## Escopo Funcional

O modulo deve cobrir os fluxos abaixo:

- Criar link de pesquisa com validade
- Listar links com filtros (status, ferramenta, busca)
- Visualizar detalhe completo de um link
- Reenviar link (canal de envio)
- Acessar pesquisa publica por token
- Registrar resposta unica por link
- Expor metricas agregadas para dashboard

## Modelagem de Dados

### Entidade Link

Campos principais:

- id: string (cuid)
- token: string (unico)
- url: string
- clienteId: string
- ferramentaId: string
- tecnicoId: string
- treinamentoNumero: int
- treinamentoTotal: int
- validadeHoras: int
- status: LinkStatus
- canalEnvio: CanalEnvio (opcional)
- enviadoEm: datetime (opcional)
- primeiroAcessoEm: datetime (opcional)
- expiradoEm: datetime
- respondidoEm: datetime (opcional)
- observacaoInterna: string (opcional)
- createdAt: datetime
- updatedAt: datetime

### Entidade Resposta

Campos principais:

- id: string (cuid)
- linkId: string (unique)
- nota: int (1 a 5)
- label: string
- emoji: string
- comentario: string (opcional)
- createdAt: datetime

### Relacoes

- Link N:1 Cliente
- Link N:1 Ferramenta
- Link N:1 Usuario (tecnico que gerou)
- Link 1:1 Resposta

## Enums

### LinkStatus

- PENDENTE
- RESPONDIDO
- EXPIRADO

### CanalEnvio

- WHATSAPP
- EMAIL
- MANUAL

## Regras de Negocio

### 1) Geracao do token

- Token deve ser unico e nao previsivel
- Recomendado: string aleatoria com alta entropia
- Deve existir indice unique para token

### 2) Estado inicial do link

- Todo link novo nasce como PENDENTE
- expiradoEm deve ser calculado no create

### 3) Expiracao

- Link nao pode ser respondido apos expiradoEm
- Ao consultar/linkar, se vencido, considerar EXPIRADO
- Opcional: job/cron para sincronizar status em lote

### 4) Resposta unica por link

- Apenas uma resposta por link/token
- Se ja existir resposta, bloquear novo submit
- Ao responder com sucesso:
	- criar Resposta
	- status do Link vira RESPONDIDO
	- preencher respondidoEm

### 5) Primeiro acesso

- primeiroAcessoEm deve ser preenchido no primeiro GET publico do token
- Se modelo de expiracao for baseado no primeiro acesso, usar esse campo
- Se expiracao for fixa desde criacao, manter apenas como auditoria

### 6) Reenvio

- Reenvio nao cria novo token por padrao
- Atualiza enviadoEm e canalEnvio
- Se houver regra de limite de envios, validar antes

### 7) Integridade e auditoria

- createdAt/updatedAt automaticos
- Rastrear tecnicoId, clienteId, ferramentaId sempre obrigatorios

## Contratos de API

Base autenticada: /api/links

Base publica: /api/public/links

### 1) Criar link

Metodo e rota:

- POST /api/links

Body:

- clienteId: string
- ferramentaId: string
- tecnicoId: string
- treinamentoNumero: number
- treinamentoTotal: number
- validadeHoras: number

Resposta 201 (resumo):

- id
- token
- url
- status
- expiradoEm
- cliente { id, nome }
- ferramenta { id, nome }
- tecnico { id, nome }

### 2) Listar links (rastreio)

Metodo e rota:

- GET /api/links?page=1&limit=20&status=PENDENTE,RESPONDIDO&ferramentaId=...&search=...

Query params:

- page (opcional, default 1)
- limit (opcional, default 20)
- status (opcional, lista)
- ferramentaId (opcional)
- search (opcional, texto para cliente/token)

Resposta 200:

- data: array
- meta: { total, page, limit, totalPages }

Item sugerido de data:

- id
- clienteNome
- ferramentaNome
- treinamentoNumero
- treinamentoTotal
- tecnicoNome
- status
- createdAt
- respondidoEm
- nota (opcional)
- emoji (opcional)
- label (opcional)
- comentario (opcional)

### 3) Detalhe do link

Metodo e rota:

- GET /api/links/:id

Resposta 200:

- dados completos do Link
- resposta (objeto ou null)

### 4) Links recentes

Metodo e rota:

- GET /api/links/recentes?limit=10

Resposta 200:

- data: [{ id, clienteNome, ferramentaNome, url, createdAt }]

### 5) Reenviar link

Metodo e rota:

- POST /api/links/:id/reenviar

Body (opcional):

- canal: WHATSAPP | EMAIL | MANUAL

Resposta 200:

- sucesso: boolean
- id
- enviadoEm
- canalEnvio

### 6) Metricas do dashboard

Metodo e rota:

- GET /api/links/metricas?periodo=7d

Resposta 200 (sugestao):

- taxaResposta: number
- pontuacaoMedia: number
- linksEnviados: number
- pendentes: number
- respondidas: number
- expiradas: number
- serieRespostasPorDia: [{ dia, quantidade }]

### 7) Consulta publica por token

Metodo e rota:

- GET /api/public/links/:token

Resposta 200 (quando valido):

- valido: true
- clienteNome
- ferramentaNome
- treinamentoNumero
- treinamentoTotal
- tecnicoNome

Resposta 200 (quando invalido):

- valido: false
- motivoInvalido: EXPIRADO | JA_RESPONDIDO | NAO_ENCONTRADO

### 8) Responder pesquisa publica

Metodo e rota:

- POST /api/public/links/:token/responder

Body:

- nota: number (1..5)
- comentario: string (opcional)

Resposta 201:

- sucesso: true
- mensagem
- respondidoEm

Erros esperados:

- 400 (payload invalido)
- 404 (token nao encontrado)
- 409 (ja respondido)
- 410 (expirado)

## Mapeamento para o Frontend Atual

Campos exibidos no rastreio:

- cliente -> cliente.nome
- ferramenta -> ferramenta.nome
- step -> treinamentoNumero + " de " + treinamentoTotal
- tecnico -> tecnico.nome
- status -> Link.status
- data -> respondidoEm (quando RESPONDIDO) ou createdAt
- nota/emoji/label/comentario -> Resposta

Cards e listagens:

- Gerador (links recentes) -> GET /api/links/recentes
- Dashboard (contadores e serie) -> GET /api/links/metricas

Tela publica de votacao:

- Carregamento por token -> GET /api/public/links/:token
- Envio de nota/comentario -> POST /api/public/links/:token/responder

## Validacoes Tecnicas Recomendadas

- nota deve estar entre 1 e 5
- treinamentoNumero >= 1
- treinamentoTotal >= treinamentoNumero
- validadeHoras em faixa permitida (ex.: 24, 48, 72)
- IDs de cliente/ferramenta/tecnico devem existir

## Indices e Performance

Indices recomendados:

- Link.token unique
- Link.status
- Link.createdAt desc
- Link.ferramentaId
- Link.tecnicoId
- Link.clienteId
- Resposta.linkId unique

## Seguranca

- Endpoints /api/links devem exigir autenticacao
- Endpoints /api/public/links devem ser anonimos com controle estrito por token
- Nunca expor dados sensiveis internos no endpoint publico

## Observacoes de Implementacao

- URL final pode ser persistida ou derivada no response
- Label e emoji podem ser calculados no backend a partir da nota
- Se necessario, adicionar contadorEnvios no Link para auditoria de reenvio
- Definir timezone padrao e serializacao ISO-8601 para datas

## Exemplo de Schema Prisma (referencia)

```prisma
enum LinkStatus {
	PENDENTE
	RESPONDIDO
	EXPIRADO
}

enum CanalEnvio {
	WHATSAPP
	EMAIL
	MANUAL
}

model Link {
	id               String      @id @default(cuid())
	token            String      @unique
	url              String
	clienteId        String
	ferramentaId     String
	tecnicoId        String
	treinamentoNumero Int
	treinamentoTotal  Int
	validadeHoras    Int
	status           LinkStatus  @default(PENDENTE)
	canalEnvio       CanalEnvio?
	enviadoEm        DateTime?
	primeiroAcessoEm DateTime?
	expiradoEm       DateTime
	respondidoEm     DateTime?
	observacaoInterna String?
	createdAt        DateTime    @default(now())
	updatedAt        DateTime    @updatedAt

	cliente          Cliente     @relation(fields: [clienteId], references: [id])
	ferramenta       Ferramenta  @relation(fields: [ferramentaId], references: [id])
	tecnico          Usuario     @relation(fields: [tecnicoId], references: [id])
	resposta         Resposta?

	@@index([status])
	@@index([createdAt])
	@@index([clienteId])
	@@index([ferramentaId])
	@@index([tecnicoId])
}

model Resposta {
	id         String   @id @default(cuid())
	linkId     String   @unique
	nota       Int
	label      String
	emoji      String
	comentario String?
	createdAt  DateTime @default(now())

	link       Link     @relation(fields: [linkId], references: [id])
}
```
