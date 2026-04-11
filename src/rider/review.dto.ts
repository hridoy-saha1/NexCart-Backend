import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {

  // ⭐ Rating must be between 1 and 5
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  // 💬 Optional comment
  @IsOptional()
  @IsString()
  comment?: string;
}   