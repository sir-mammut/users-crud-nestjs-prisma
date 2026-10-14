import { Exclude } from 'class-transformer';
import { User as PrismaUser, UserRole } from '../../generated/prisma/client.js';

/**
 * UserResponse is a "view" of the Prisma User model
 * that never exposes the password field.
 */
export class UserResponse implements Omit<PrismaUser, 'password'> {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<PrismaUser>) {
    Object.assign(this, partial);
  }
}