import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findMany(@Query() userFilterDto: UserFilterDto): Promise<User[]> {
    return this.usersService.findMany(userFilterDto);
  }

  @Get('find')
  findFirst(@Query() userFilterDto: UserFilterDto): Promise<User> {
    return this.usersService.findFirst(userFilterDto);
  }

  @Get(':id')
  findUnique(@Param('id') id: string): Promise<User> {
    return this.usersService.findUnique(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
