import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reservation.findMany({
      include: {
        user: true,
        table: true,
      },
    });
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        table: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async create(dto: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        date: new Date(dto.date),
        time: dto.time,
        numberOfPeople: dto.numberOfPeople,
        userId: dto.userId,
        tableId: dto.tableId,
      },
      include: {
        user: true,
        table: true,
      },
    });
  }

  async update(id: number, dto: CreateReservationDto) {
    await this.findOne(id);

    return this.prisma.reservation.update({
      where: { id },
      data: {
        date: new Date(dto.date),
        time: dto.time,
        numberOfPeople: dto.numberOfPeople,
        userId: dto.userId,
        tableId: dto.tableId,
      },
      include: {
        user: true,
        table: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}