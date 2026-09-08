import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';

import { OrderType } from '@prisma/client';

export class CreateOrderItemDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}