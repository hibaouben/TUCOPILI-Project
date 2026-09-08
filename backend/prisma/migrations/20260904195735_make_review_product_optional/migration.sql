-- DropForeignKey
ALTER TABLE "avis" DROP CONSTRAINT "avis_id_produit_fkey";

-- AlterTable
ALTER TABLE "avis" ALTER COLUMN "id_produit" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produit"("id_produit") ON DELETE SET NULL ON UPDATE CASCADE;
