import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import {
  RiderStatus,
  VehicleType,
} from './rider.entity';

export class CreateRiderDto {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  // Rider Status
  @IsOptional()
  @IsEnum(RiderStatus)
  status?: RiderStatus;

  // Vehicle Type
  @IsOptional()
  @IsEnum(VehicleType)
  vehicle_type?: VehicleType;

  // Current Location
  @IsOptional()
  @IsString()
  current_location?: string;

  // Profile Image
  @IsOptional()
  @IsString()
  profileImage?: string;
}

export class riderLoginDto {

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;
}