import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../generated/prisma/client.js';

export class CreateUserDto {
  /** User's first name */
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /** User's last name */
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /** User's email address (must be unique) */
  @IsEmail()
  email: string;

  /** User's password (minimum 6 characters) */
  @IsString()
  @MinLength(6)
  password: string;

  /** User's role. Defaults to USER if not provided */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /** Whether the user account is active. Defaults to true */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}