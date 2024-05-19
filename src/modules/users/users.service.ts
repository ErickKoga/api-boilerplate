import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { accessibleBy } from '@casl/prisma';
import { AbilityFactory, Action } from '../authorization/ability.factory';
import abilityFields from 'src/helpers/ability-fields';
import { Role } from '../roles/entities/role.entity';
import { PayloadDto } from '../auth/dto/payload.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  private readonly fields = Object.keys(this.prisma.user.fields);

  async create(createUserDto: CreateUserDto): Promise<User> {
    const response = await this.prisma.user.create({
      data: createUserDto,
    });
    return plainToInstance(User, response);
  }

  async findMany(
    userReq: PayloadDto,
    userFilterDto?: UserFilterDto,
  ): Promise<User[]> {
    const ability = this.abilityFactory.createForUser(userReq);
    const { withDeleted, withRole, ...data } = userFilterDto;

    const response = await this.prisma.user.findMany({
      where: {
        ...data,
        deletedAt: withDeleted ? undefined : null,
        ...accessibleBy(ability).User,
      },
      select: {
        ...abilityFields(ability, Action.Read, User, this.fields),
        role: withRole
          ? {
              select: abilityFields(ability, Action.Read, Role, this.fields),
            }
          : undefined,
      },
    });

    if (!response.length) {
      throw new HttpException('No users were found.', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(User, response);
  }

  async findFirst(
    userReq: PayloadDto,
    userFilterDto: UserFilterDto,
  ): Promise<User> {
    const ability = this.abilityFactory.createForUser(userReq);
    const { withDeleted, withRole, ...data } = userFilterDto;

    const response = await this.prisma.user.findFirstOrThrow({
      where: { ...data, deletedAt: withDeleted ? undefined : null },
      select: {
        ...abilityFields(ability, Action.Read, User, this.fields),
        role: withRole
          ? {
              select: abilityFields(ability, Action.Read, Role, this.fields),
            }
          : undefined,
      },
    });

    return plainToInstance(User, response);
  }

  async findUnique(userReq: PayloadDto, id: string): Promise<User> {
    const ability = this.abilityFactory.createForUser(userReq);
    const response = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        ...abilityFields(ability, Action.Read, User, this.fields),
        role: {
          select: abilityFields(ability, Action.Read, Role, this.fields),
        },
      },
    });

    return plainToInstance(User, response);
  }

  async update(
    userReq: PayloadDto,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const ability = this.abilityFactory.createForUser(userReq);
    const { roleId, ...data } = updateUserDto;
    const allowedFields = abilityFields(
      ability,
      Action.Update,
      User,
      this.fields,
    );

    for (const [field] of Object.entries(updateUserDto)) {
      if (!allowedFields[field]) {
        throw new HttpException(
          `You are not allowed to update the field: ${field}`,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const response = await this.prisma.user.update({
      where: { id },
      data: { ...data, role: roleId ? { connect: { id: roleId } } : undefined },
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
