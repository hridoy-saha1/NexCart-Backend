import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsDefined,
  IsNotEmpty,
  Matches,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  // NAME (no numbers)
  @IsDefined({ message: 'Name is required' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must not contain numbers',
  })
  name: string;

  // EMAIL (unique identity)
  @IsDefined({ message: 'Email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  // PASSWORD (must contain special character)
  @IsDefined({ message: 'Password is required' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[@#$&]).+$/, {
    message: 'Password must contain at least one special character (@ # $ &)',
  })
  password: string;

  // OPTIONAL ACTIVE STATUS
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
