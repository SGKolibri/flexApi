Especificação Técnica - Módulo de Cliente e Ferramenta (Backend)
Objetivo
Definir o modelo, relações e regras de negócio para as entidades Cliente e Ferramenta, que são fundamentais para o fluxo de geração e rastreio de links de pesquisa.

Escopo Funcional
O módulo deve cobrir os fluxos abaixo:

Cadastro, edição e consulta de clientes
Cadastro, edição e consulta de ferramentas
Associação de links de pesquisa a clientes e ferramentas
Garantir integridade e auditoria das relações
Modelagem de Dados
Entidade Cliente
Campos principais:

id: string (cuid)
nome: string
documento: string (opcional, ex: CNPJ)
contato: string (opcional)
email: string (opcional)
ativo: boolean (default: true)
observacaoInterna: string (opcional)
createdAt: datetime
updatedAt: datetime
Relações
Cliente 1:N Link (um cliente pode ter vários links de pesquisa)
Cliente pode ser referenciado em métricas e rastreio
Entidade Ferramenta
Campos principais:

id: string (cuid)
nome: string
descricao: string (opcional)
ativo: boolean (default: true)
observacaoInterna: string (opcional)
createdAt: datetime
updatedAt: datetime
Relações
Ferramenta 1:N Link (uma ferramenta pode ter vários links de pesquisa)
Ferramenta pode ser referenciada em métricas e rastreio
Regras de Negócio
Cliente
Cadastro:

nome obrigatório
documento, contato e email opcionais, mas validados se informados
ativo default true
Edição:

Permitir atualização de campos, exceto id e createdAt
Histórico de alterações pode ser auditado via updatedAt
Exclusão:

Exclusão lógica (ativo = false) recomendada para preservar histórico de links
Integridade:

Não permitir cadastro de clientes com nome duplicado
Validar formato de documento (ex: CNPJ) se informado
Auditoria:

createdAt/updatedAt automáticos
observacaoInterna para uso administrativo
Ferramenta
Cadastro:

nome obrigatório
descricao opcional
ativo default true
Edição:

Permitir atualização de campos, exceto id e createdAt
Exclusão:

Exclusão lógica (ativo = false) recomendada para preservar histórico de links
Integridade:

Não permitir cadastro de ferramentas com nome duplicado
Auditoria:

createdAt/updatedAt automáticos
observacaoInterna para uso administrativo
Contratos de API
Base autenticada: /api/clientes e /api/ferramentas

Cliente
POST /api/clientes

Body: { nome, documento?, contato?, email?, observacaoInterna? }
Resposta: dados do cliente
GET /api/clientes

Query: filtros por nome, ativo, documento
Resposta: lista de clientes
GET /api/clientes/:id

Resposta: dados completos do cliente
PUT /api/clientes/:id

Body: campos editáveis
Resposta: dados atualizados
DELETE /api/clientes/:id

Exclusão lógica (ativo = false)
Resposta: sucesso
Ferramenta
POST /api/ferramentas

Body: { nome, descricao?, observacaoInterna? }
Resposta: dados da ferramenta
GET /api/ferramentas

Query: filtros por nome, ativo
Resposta: lista de ferramentas
GET /api/ferramentas/:id

Resposta: dados completos da ferramenta
PUT /api/ferramentas/:id

Body: campos editáveis
Resposta: dados atualizados
DELETE /api/ferramentas/:id

Exclusão lógica (ativo = false)
Resposta: sucesso

Exemplo de Schema Prisma (referência)
model Cliente {
    id               String   @id @default(cuid())
    nome             String
    documento        String? 
    contato          String?
    email            String?
    ativo            Boolean  @default(true)
    observacaoInterna String?
    createdAt        DateTime @default(now())
    updatedAt        DateTime @updatedAt

    links            Link[]
    @@unique([nome])
}

model Ferramenta {
    id               String   @id @default(cuid())
    nome             String
    descricao        String?
    ativo            Boolean  @default(true)
    observacaoInterna String?
    createdAt        DateTime @default(now())
    updatedAt        DateTime @updatedAt

    links            Link[]
    @@unique([nome])
}

Indices e Performance
Cliente.nome unique
Ferramenta.nome unique
Cliente.ativo, Ferramenta.ativo para filtros rápidos
Segurança
Endpoints devem exigir autenticação
Nunca expor dados sensíveis internos (observacaoInterna) em endpoints públicos
Observações de Implementação
Exclusão lógica para preservar histórico
Serialização ISO-8601 para datas
Validar dados de entrada conforme regras de negócio
