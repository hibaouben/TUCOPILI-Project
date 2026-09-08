import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { CategoriesModule } from './categories/categories.module';

import { ProductsModule } from './products/products.module';

import { OrdersModule } from './orders/orders.module';

import { ReservationsModule } from './reservations/reservations.module';

import { TablesModule } from './tables/tables.module';

import { ReviewsModule } from './reviews/reviews.module';

import { AuthModule } from './auth/auth.module';

import { UsersModule } from './users/users.module';

@Module({
imports: [
ConfigModule.forRoot({
isGlobal: true,
}),


PrismaModule,

CategoriesModule,
ProductsModule,
OrdersModule,
ReservationsModule,
TablesModule,
ReviewsModule,
UsersModule,
AuthModule,


],
})
export class AppModule {}
