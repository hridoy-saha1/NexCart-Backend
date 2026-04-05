// import { IsNotEmpty, IsString, Matches } from 'class-validator';
// import { Type } from 'class-transformer';

// export class CreateProductDto {
//   productName: string;
//   description: string;
//   price: number;
//   stock: number;
// }

// export class UpdateProductDto {
//   productName?: string;
//   description?: string;
//   price?: number;
//   stock?: number;
// }

// export enum OrderStatus {
//   CONFIRMED = 'CONFIRMED',
//   PACKED = 'PACKED',
//   SHIPPED = 'SHIPPED',
//   CANCELLED = 'CANCELLED',
// }

// export class UpdateOrderStatusDto {
//   status: OrderStatus;
// }

// export class PayoutRequestDto {
//   amount: number;
//   bankAccount: string;
// }

// export class SellerRegistrationDto {
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^[A-Za-z]+$/, {
//     message: 'Name must contain only alphabets',
//   })
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^[^\s@]+@[^\s@]+\.xyz$/i, {
//     message: 'Email must be a valid address ending with .xyz',
//   })
//   email: string;

//   @IsNotEmpty()
//   @Matches(/^(\d{10}|\d{15})$/, {
//     message: 'NID must be exactly 10 or 15 digits',
//   })
//   nidNumber: string;
// }

// //newly added
// import { IsBoolean, IsOptional } from 'class-validator';

// export class CreateSellerDto {
//   @IsOptional()
//   @IsString()
//   fullName?: string | null;

//   @IsNotEmpty()
//   @IsString()
//   @Matches(/^\d+$/, {
//     message: 'phone must contain only digits',
//   })
//   phone: string;

//   @IsOptional()
//   @IsBoolean()
//   isActive?: boolean;
// }

// export class UpdateSellerPhoneDto {
//   @IsNotEmpty()
//   @IsString()
//   @Matches(/^\d+$/, {
//     message: 'phone must contain only digits',
//   })
//   phone: string;
// }

// export class DeleteSellerDto {
//   @IsNotEmpty()
//   @IsString()
//   id: string;
// }

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
