-- DropForeignKey
ALTER TABLE "public"."Resposta" DROP CONSTRAINT "Resposta_linkId_fkey";

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
