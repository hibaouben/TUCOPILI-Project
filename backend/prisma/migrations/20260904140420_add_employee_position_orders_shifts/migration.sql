-- CreateEnum
CREATE TYPE "EmployeePosition" AS ENUM ('CUISINIER', 'CAISSIER');

-- AlterTable
ALTER TABLE "commande" ADD COLUMN     "id_employe" INTEGER;

-- AlterTable
ALTER TABLE "utilisateur" ADD COLUMN     "poste" "EmployeePosition";

-- CreateTable
CREATE TABLE "shift" (
    "id_shift" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure_debut" TEXT NOT NULL,
    "heure_fin" TEXT NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "shift_pkey" PRIMARY KEY ("id_shift")
);

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_id_employe_fkey" FOREIGN KEY ("id_employe") REFERENCES "utilisateur"("id_utilisateur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift" ADD CONSTRAINT "shift_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;
