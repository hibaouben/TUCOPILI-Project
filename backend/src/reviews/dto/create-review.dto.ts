import { IsInt, IsString, Max, Min, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsInt()
  @Min(1)
  userId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  productId?: number;
}