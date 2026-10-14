import { 
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { QueryUsersDto } from './dto/query-users.dto.js';
import { UserResponse } from './entities/user.entity.js';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
    // ─────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────
    async create(createUserDto: CreateUserDto): Promise<UserResponse> {
        // 1. Hash the password before saving
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // 2. Create the user in the database
        try {
        const user = await this.prisma.user.create({
            data: {
            ...createUserDto,
            password: hashedPassword,
            },
        });

        // 3. Return the user WITHOUT the password
        return new UserResponse(user);
        } catch (error) {
        // Prisma error code P2002 = unique constraint violation
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new ConflictException('A user with this email already exists');
        }
        throw error;
        }
    }

    // ─────────────────────────────────────────────
    // READ ALL (with pagination, search, filters)
    // ─────────────────────────────────────────────
    async findAll(query: QueryUsersDto): Promise<{
        data: UserResponse[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 10, search, role, isActive } = query;

        // Build the WHERE clause dynamically
        const where: Prisma.UserWhereInput = {};

        if (search) {
        where.OR = [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
        ];
        }

        if (role) {
            where.role = role;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        // Run count + fetch in parallel for speed
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users.map((user) => new UserResponse(user)),
            total,
            page,
            limit,
        };
    }

    // ─────────────────────────────────────────────
    // READ ONE
    // ─────────────────────────────────────────────
    async findOne(id: string): Promise<UserResponse> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }

        return new UserResponse(user);
    }

    
    // ─────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────
    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UserResponse> {
        // Ensure the user exists first
        await this.findOne(id);

        // Hash password if it's being updated
        const data: Prisma.UserUpdateInput = { ...updateUserDto };

        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        try {
            const updated = await this.prisma.user.update({
                where: { id },
                data,
            });

            return new UserResponse(updated);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('A user with this email already exists');
            }
            throw error;
        }
    }

    // ─────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────
    async remove(id: string): Promise<void> {
        // Ensure the user exists first
        await this.findOne(id);

        await this.prisma.user.delete({ where: { id } });
    }
}
