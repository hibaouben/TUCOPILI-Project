import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsInt()
  @Min(1)
  numberOfPeople: number;

  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  tableId: number;
}