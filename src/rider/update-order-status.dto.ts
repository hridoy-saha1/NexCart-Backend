import { IsEnum, IsNumber } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['processing', 'delivered'])
  status: 'processing' | 'delivered';

  @IsNumber()
  riderId: number;
}