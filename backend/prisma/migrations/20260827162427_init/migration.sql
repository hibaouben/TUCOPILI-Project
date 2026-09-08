-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'EMPLOYEE', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DELIVERY');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'UNAVAILABLE');

-- CreateTable
CREATE TABLE "utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "telephone" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "categorie" (
    "id_categorie" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categorie_pkey" PRIMARY KEY ("id_categorie")
);

-- CreateTable
CREATE TABLE "produit" (
    "id_produit" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "price" DECIMAL(10,2) NOT NULL,
    "image" TEXT,
    "id_categorie" INTEGER NOT NULL,

    CONSTRAINT "produit_pkey" PRIMARY KEY ("id_produit")
);

-- CreateTable
CREATE TABLE "commande" (
    "id_commande" SERIAL NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "type" "OrderType" NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "commande_pkey" PRIMARY KEY ("id_commande")
);

-- CreateTable
CREATE TABLE "ligne_commande" (
    "id_ligne" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,
    "id_commande" INTEGER NOT NULL,
    "id_produit" INTEGER NOT NULL,

    CONSTRAINT "ligne_commande_pkey" PRIMARY KEY ("id_ligne")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id_reservation" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "nombres_personnes" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "id_utilisateur" INTEGER NOT NULL,
    "id_table" INTEGER NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id_reservation")
);

-- CreateTable
CREATE TABLE "table" (
    "id_table" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "TableStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "table_pkey" PRIMARY KEY ("id_table")
);

-- CreateTable
CREATE TABLE "avis" (
    "id_avis" SERIAL NOT NULL,
    "note" INTEGER NOT NULL,
    "comment" TEXT,
    "date_avis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_utilisateur" INTEGER NOT NULL,
    "id_produit" INTEGER NOT NULL,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("id_avis")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "table_numero_key" ON "table"("numero");

-- AddForeignKey
ALTER TABLE "produit" ADD CONSTRAINT "produit_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "categorie"("id_categorie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligne_commande" ADD CONSTRAINT "ligne_commande_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "commande"("id_commande") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligne_commande" ADD CONSTRAINT "ligne_commande_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produit"("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_id_table_fkey" FOREIGN KEY ("id_table") REFERENCES "table"("id_table") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produit"("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE;
