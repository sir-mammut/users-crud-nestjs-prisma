import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Other modules (e.g., Auth) can use it
})
export class UsersModule {}
