import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

// Makes every property optional — perfect for PATCH requests
export class UpdateUserDto extends PartialType(CreateUserDto) {}