import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './errors/user-not-found.exception';
import { UsersQueryDto } from './dto/users-query.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { UsersListResponseDto } from './dto/users-list-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UsersListResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  getAll(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  getById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  @Post()
  @Roles('admin')
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    const user = this.usersService.update(id, body);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  remove(@Param('id', ParseIntPipe) id: number) {
    const removed = this.usersService.remove(id);
    if (!removed) {
      throw new UserNotFoundException(id);
    }
    return { deleted: true };
  }
}
