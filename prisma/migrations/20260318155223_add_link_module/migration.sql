-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDENTE', 'RESPONDIDO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "CanalEnvio" AS ENUM ('WHATSAPP', 'EMAIL', 'MANUAL');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ferramenta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ferramenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "ferramentaId" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "treinamentoNumero" INTEGER NOT NULL,
    "treinamentoTotal" INTEGER NOT NULL,
    "validadeHoras" INTEGER NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'PENDENTE',
    "canalEnvio" "CanalEnvio",
    "enviadoEm" TIMESTAMP(3),
    "primeiroAcessoEm" TIMESTAMP(3),
    "expiradoEm" TIMESTAMP(3) NOT NULL,
    "respondidoEm" TIMESTAMP(3),
    "observacaoInterna" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_token_key" ON "Link"("token");

-- CreateIndex
CREATE INDEX "Link_status_idx" ON "Link"("status");

-- CreateIndex
CREATE INDEX "Link_createdAt_idx" ON "Link"("createdAt");

-- CreateIndex
CREATE INDEX "Link_clienteId_idx" ON "Link"("clienteId");

-- CreateIndex
CREATE INDEX "Link_ferramentaId_idx" ON "Link"("ferramentaId");

-- CreateIndex
CREATE INDEX "Link_tecnicoId_idx" ON "Link"("tecnicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Resposta_linkId_key" ON "Resposta"("linkId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_ferramentaId_fkey" FOREIGN KEY ("ferramentaId") REFERENCES "Ferramenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
