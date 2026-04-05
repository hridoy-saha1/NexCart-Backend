import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSellerShopDto {
  @IsString()
  @IsNotEmpty()
  shopName!: string;

  @IsString()
  @IsNotEmpty()
  shopAddress!: string;

  @IsString()
  @IsNotEmpty()
  tradeLicense!: string;
}

export class UpdateSellerShopDto {
  @IsOptional()
  @IsString()
  shopName?: string;

  @IsOptional()
  @IsString()
  shopAddress?: string;

  @IsOptional()
  @IsString()
  tradeLicense?: string;
}
