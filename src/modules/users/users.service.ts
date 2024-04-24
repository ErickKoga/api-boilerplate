import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.prisma.user.create({ data: createUserDto });
  }

  async findMany(userFilterDto?: UserFilterDto): Promise<UserResponseDto[]> {
    return await this.prisma.user.findMany({ where: userFilterDto });
  }

  async findFirst(userFilterDto: UserFilterDto): Promise<UserResponseDto> {
    return await this.prisma.user.findFirst({ where: userFilterDto });
  }

  async findUnique(id: string): Promise<UserResponseDto> {
    return await this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
