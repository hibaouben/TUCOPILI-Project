import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cafeTable.findMany({
      include: {
        reservations: true,
      },
    });
  }

  async findOne(id: number) {
    const table = await this.prisma.cafeTable.findUnique({
      where: { id },
      include: {
        reservations: true,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async create(dto: CreateTableDto) {
    return this.prisma.cafeTable.create({
      data: {
        number: dto.number,
        capacity: dto.capacity,
        status: dto.status ?? 'AVAILABLE',
      },
    });
  }

  async update(id: number, dto: CreateTableDto) {
    await this.findOne(id);

    return this.prisma.cafeTable.update({
      where: { id },
      data: {
        number: dto.number,
        capacity: dto.capacity,
        status: dto.status,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.cafeTable.delete({
      where: { id },
    });
  }
}