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
    const response = await this.prisma.user
      .findMany({
        where: { ...data, deletedAt: withDeleted ? undefined : null },
      })
      .then((data) => {
        if (!data.length)
          throw new HttpException('No users were found.', HttpStatus.NOT_FOUND);
        return data;
      });

    return plainToInstance(User, response);
  }

  async findFirst(userFilterDto: UserFilterDto): Promise<User> {
    const { withDeleted, ...data } = userFilterDto;
    if (!data || Object.entries(data).length === 0)
      throw new HttpException(
        'No arguments were provided.',
        HttpStatus.BAD_REQUEST,
      );
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
    const response = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return plainToInstance(User, response);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
