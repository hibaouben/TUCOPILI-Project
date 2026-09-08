import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  create(@Body() dto: CreateShiftDto) {
    return this.shiftsService.create(dto);
  }

  @Get()
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get('employee/:id')
  findByEmployee(@Param('id') id: string) {
    return this.shiftsService.findByEmployee(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(+id);
  }
}