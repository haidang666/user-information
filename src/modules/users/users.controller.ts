import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/users')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/user/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserFromReqRes(id);
  }

  @Get('/user/:id/avatar')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserAvatar(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserAvatar(id);
  }

  @Delete('/user/:id/avatar')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteUserAvatar(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserAvatar(id);
  }
}
