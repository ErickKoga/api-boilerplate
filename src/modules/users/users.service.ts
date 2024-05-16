import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const response = await this.prisma.user.create({ data: createUserDto });
    return plainToInstance(User, response);
  }

  async findMany(userFilterDto?: UserFilterDto): Promise<User[]> {
    const { withDeleted, ...data } = userFilterDto;
    const response = await this.prisma.user.findMany({
      where: { ...data, deletedAt: withDeleted ? undefined : null },
    });

    if (!response.length) {
      throw new HttpException('No users were found.', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(User, response);
  }

  async findFirst(userFilterDto: UserFilterDto): Promise<User> {
    const { withDeleted, ...data } = userFilterDto;

    const response = await this.prisma.user.findFirstOrThrow({
      where: { ...data, deletedAt: withDeleted ? undefined : null },
    });

    return plainToInstance(User, response);
  }

  async findUnique(id: string): Promise<User> {
    const response = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(User, response);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { roleId, ...data } = updateUserDto;
    const response = await this.prisma.user.update({
      where: { id },
      data: { ...data, role: { connect: { id: roleId } } },
    });

    return plainToInstance(User, response);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<User> {
    const response = await this.prisma.user.update({
      where: { id, deletedAt: { not: null } },
      data: { deletedAt: null },
    });

    if (!response) {
      throw new HttpException(
        'User not found or not soft deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToInstance(User, response);
  }
}
