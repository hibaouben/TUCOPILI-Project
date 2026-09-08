import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // TOUS LES UTILISATEURS
  // =========================
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        position: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  // =========================
  // TOUS LES EMPLOYÉS
  // =========================
  async getEmployees() {
    return this.prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        position: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================
  // STATISTIQUES EMPLOYÉS
  // =========================
  async getEmployeesStats() {
    const employees = await this.prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,

        employeeOrders: {
          select: {
            id: true,
          },
        },

        shifts: {
          orderBy: {
            date: 'desc',
          },
          take: 7,
        },
      },
    });

    return employees.map((employee) => ({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      ordersHandled: employee.employeeOrders.length,
      shifts: employee.shifts,
    }));
  }

  // =========================
  // CRÉER UN EMPLOYÉ
  // =========================
  async createEmployee(dto: CreateEmployeeDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Cette adresse email est déjà utilisée.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const employee = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone || null,

        // IMPORTANT :
        // ce compte est un EMPLOYÉ,
        // pas un ADMIN
        role: 'EMPLOYEE',

        position: dto.position,
      },

      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        position: true,
        createdAt: true,
      },
    });

    return employee;
  }
}