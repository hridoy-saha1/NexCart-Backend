import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AssignRiderDto {
  @Type(() => Number)
  @IsInt()
  riderId: number;
}
