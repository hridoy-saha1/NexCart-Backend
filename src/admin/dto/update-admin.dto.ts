/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'Name must not contain numbers',
    })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @Matches(/^(?=.*[@#$&]).+$/, {
        message: 'Password must contain at least one special character (@ # $ &)',
    })
    password?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: 'isActive must be boolean' })
    isActive?: boolean;
}
