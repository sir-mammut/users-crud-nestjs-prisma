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
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  }