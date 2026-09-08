import { IsInt, IsDateString, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsInt()
  employeeId: number;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}