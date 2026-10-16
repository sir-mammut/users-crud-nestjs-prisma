import { 
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { 
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam
 } from '@nestjs/swagger';


import { UsersService } from './users.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { QueryUsersDto } from './dto/query-users.dto.js';
import { UserResponse } from './entities/user.entity.js';

/**
 * UsersController is the HTTP entry point for user-related requests.
 * It stays thin — all real logic lives in UsersService.
 */
@ApiTags('Users') // Groups all endpoints under "Users" in Swagger UI
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * POST /api/users
     * Creates a new user.
     * Body is validated automatically by the global ValidationPipe.
    */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
      status: 201,
      description: 'User created successfully',
      type: UserResponse,
    })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        return this.usersService.create(createUserDto);
    }

    /**
     * GET /api/users?page=1&limit=10&search=john&role=USER&isActive=true
     * Lists users with pagination, search, and filters.
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'List users with pagination, search, and filters' })
    @ApiResponse({
        status: 200,
        description: 'Users retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/UserResponse' } },
                total: { type: 'number', example: 42 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
            },
        },
    })
    async findAll(@Query() query: QueryUsersDto): Promise<{
        data: UserResponse[];
        total: number;
        page: number;
        limit: number;
    }> {
        return this.usersService.findAll(query);
    }

    /**
     * GET /api/users/:id
     * Fetches a single user by UUID.
     * ParseUUIDPipe rejects invalid IDs with a 400 Bad Request.
     */
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a single user by ID' })
    @ApiParam({ name: 'id', description: 'User UUID', format: 'uuid' })
    @ApiResponse({
      status: 200,
      description: 'User found',
      type: UserResponse,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
        return this.usersService.findOne(id);
    }

    /**
     * PATCH /api/users/:id
     * Updates a user. All fields are optional.
     */
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({ name: 'id', description: 'User UUID', format: 'uuid' })
    @ApiResponse({
      status: 200,
      description: 'User updated successfully',
      type: UserResponse,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponse> {
        return this.usersService.update(id, updateUserDto);
    }

    /**
     * DELETE /api/users/:id
     * Deletes a user and returns 204 No Content on success.
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', description: 'User UUID', format: 'uuid' })
    @ApiResponse({ status: 204, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
