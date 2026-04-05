import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SellerRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabets and spaces',
  })
  name!: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'Phone must contain only digits',
  })
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(\d{10}|\d{15})$/, {
    message: 'NID must be exactly 10 or 15 digits',
  })
  nidNumber!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must contain only alphabets and spaces',
  })
  name?: string;

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
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
