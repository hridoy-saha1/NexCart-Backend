import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsEnum(ProductCategory, {
    message:
      'Category must be one of: Electronics, Fashion, Home & Living, Beauty, Sports',
  })
  category: ProductCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @Type(() => Number)
  @IsInt({ message: 'Quantity must be an integer number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsEnum(ProductCategory, {
    message:
      'Category must be one of: Electronics, Fashion, Home & Living, Beauty, Sports',
  })
  category?: ProductCategory;

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
  @IsInt({ message: 'Quantity must be an integer number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity?: number;
}