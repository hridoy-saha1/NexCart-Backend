//new

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// =========================
// Seller DTOs
// =========================

export class SellerRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabets and spaces',
  })
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'Phone must contain only digits',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(\d{10}|\d{15})$/, {
    message: 'NID must be exactly 10 or 15 digits',
  })
  nidNumber: string;
}

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must contain only alphabets and spaces',
  })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'Phone must contain only digits',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\d{10}|\d{15})$/, {
    message: 'NID must be exactly 10 or 15 digits',
  })
  nidNumber?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// =========================
// Product DTOs
// =========================

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity?: number;
}
