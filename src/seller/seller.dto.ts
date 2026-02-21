import {
  IsNotEmpty,
  IsString,
  Matches,
  IsInt,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  productName: string;
  description: string;
  price: number;
  stock: number;
}

export class UpdateProductDto {
  productName?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  status: OrderStatus;
}

export class PayoutRequestDto {
  amount: number;
  bankAccount: string;
}

export class SellerRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, {
    message: 'Name must contain only alphabets',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\s@]+@[^\s@]+\.xyz$/i, {
    message: 'Email must be a valid address ending with .xyz',
  })
  email: string;

  @IsNotEmpty()
  @Matches(/^(\d{10}|\d{15})$/, {
    message: 'NID must be exactly 10 or 15 digits',
  })
  nidNumber: string;
}

