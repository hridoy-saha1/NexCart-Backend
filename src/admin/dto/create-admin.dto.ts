import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  // NAME (no numbers)
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must not contain numbers',
  })
  name!: string;

  // EMAIL (unique identity)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  // PASSWORD (must contain special character)
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[@#$&]).+$/, {
    message: 'Password must contain at least one special character (@ # $ &)',
  })
  password!: string;

  // OPTIONAL ACTIVE STATUS
  isActive?: boolean;
}
