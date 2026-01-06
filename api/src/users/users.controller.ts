import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    const user = this.usersService.update(id, body);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const removed = this.usersService.remove(id);
    if (!removed) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { deleted: true };
  }
}
