import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateShiftDto) {
    return this.prisma.shift.create({
      data: {
        employeeId: dto.employeeId,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  findAll() {
    return this.prisma.shift.findMany({
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }

  findByEmployee(employeeId: number) {
    return this.prisma.shift.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
    });
  }

  remove(id: number) {
    return this.prisma.shift.delete({ where: { id } });
  }
}