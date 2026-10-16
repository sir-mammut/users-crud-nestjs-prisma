import { Type, Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../generated/prisma/client.js';

export class QueryUsersDto {
  /** Page number (starts at 1) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /** Number of users per page */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  /** Search term applied to firstName, lastName, and email */
  @IsOptional()
  @IsString()
  search?: string;

  /** Filter by role */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /** Filter by active status */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}