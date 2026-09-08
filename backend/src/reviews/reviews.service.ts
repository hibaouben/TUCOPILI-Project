import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId: dto.userId,
        ...(dto.productId !== undefined && { productId: dto.productId }),
      },
      include: {
        user: true,
        product: true,
      },
    });
  }

  async update(id: number, dto: CreateReviewDto) {
    await this.findOne(id);

    return this.prisma.review.update({
      where: { id },
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId: dto.userId,
        ...(dto.productId !== undefined && { productId: dto.productId }),
      },
      include: {
        user: true,
        product: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.review.delete({
      where: { id },
    });
  }
}