import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateRiderDto {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsEnum(['available', 'busy', 'offline'])
  status: 'available' | 'busy' | 'offline';

  @IsOptional()
  @IsString()
  vehicle_type?: string;

  @IsOptional()
  @IsString()
  current_location?: string;

  @IsOptional()
  @IsString()
  image?: string;
}