import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { User as PrismaUser, UserRole } from '../../generated/prisma/client.js';

/**
 * UserResponse is a "view" of the Prisma User model
 * that never exposes the password field.
 */
export class UserResponse implements Omit<PrismaUser, 'password'> {
  /** Unique identifier (UUID) */
  id: string;

  /** User's first name */
  firstName: string;

  /** User's last name */
  lastName: string;

  /** User's email address */
  email: string;

  /** User's role */
  role: UserRole;

  /** Whether the user account is active */
  isActive: boolean;

  /** When the user was created */
  createdAt: Date;

  /** When the user was last updated */
  updatedAt: Date;

  @ApiHideProperty() // Never expose the password in the Swagger schema
  @Exclude()
  password: string;

  constructor(partial: Partial<PrismaUser>) {
    Object.assign(this, partial);
  }
}