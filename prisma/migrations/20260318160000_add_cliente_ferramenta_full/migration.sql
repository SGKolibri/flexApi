-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "telefone",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contato" TEXT,
ADD COLUMN     "documento" TEXT,
ADD COLUMN     "observacaoInterna" TEXT;

-- AlterTable
ALTER TABLE "Ferramenta" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "observacaoInterna" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_nome_key" ON "Cliente"("nome");

-- CreateIndex
CREATE INDEX "Cliente_ativo_idx" ON "Cliente"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "Ferramenta_nome_key" ON "Ferramenta"("nome");

-- CreateIndex
CREATE INDEX "Ferramenta_ativo_idx" ON "Ferramenta"("ativo");
