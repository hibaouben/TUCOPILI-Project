import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // =========================
  // TOUS LES UTILISATEURS
  // GET /api/users
  // =========================
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // =========================
  // TOUS LES EMPLOYÉS
  // GET /api/users/employees
  // =========================
  @Get('employees')
  getEmployees() {
    return this.usersService.getEmployees();
  }

  // =========================
  // STATISTIQUES EMPLOYÉS
  // GET /api/users/employees/stats
  // =========================
  @Get('employees/stats')
  getEmployeesStats() {
    return this.usersService.getEmployeesStats();
  }

  // =========================
  // CRÉER UN EMPLOYÉ
  // POST /api/users/employees
  // =========================
  @Post('employees')
  createEmployee(
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.usersService.createEmployee(dto);
  }
}