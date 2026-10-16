import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';

// Makes every property optional — perfect for PATCH requests
export class UpdateUserDto extends PartialType(CreateUserDto) {}