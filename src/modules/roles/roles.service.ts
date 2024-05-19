import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/database/prisma.service';
import { RoleFilterDto } from './dto/role-filter.dto';
import { Role } from './entities/role.entity';
import { plainToInstance } from 'class-transformer';
import { PayloadDto } from '../auth/dto/payload.dto';
import { AbilityFactory, Action } from '../authorization/ability.factory';
import abilityFields from 'src/helpers/ability-fields';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  private readonly fields = Object.keys(this.prisma.role.fields);

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const response = await this.prisma.role.create({ data: createRoleDto });
    return plainToInstance(Role, response);
  }

  async findMany(
    userReq: PayloadDto,
    roleFilterDto?: RoleFilterDto,
  ): Promise<Role[]> {
    const ability = this.abilityFactory.createForUser(userReq);
    const { withDeleted, ...data } = roleFilterDto;

    const response = await this.prisma.role.findMany({
      where: { ...data, deletedAt: withDeleted ? undefined : null },
      select: {
        ...abilityFields(ability, Action.Read, Role, this.fields),
      },
    });

    if (!response.length) {
      throw new HttpException('No roles were found.', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(Role, response);
  }

  async findFirst(
    userReq: PayloadDto,
    roleFilterDto: RoleFilterDto,
  ): Promise<Role> {
    const ability = this.abilityFactory.createForUser(userReq);
    const { withDeleted, ...data } = roleFilterDto;

    const response = await this.prisma.role.findFirstOrThrow({
      where: { ...data, deletedAt: withDeleted ? undefined : null },
      select: {
        ...abilityFields(ability, Action.Read, Role, this.fields),
      },
    });

    return plainToInstance(Role, response);
  }

  async findUnique(userReq: PayloadDto, id: string): Promise<Role> {
    const ability = this.abilityFactory.createForUser(userReq);
    const response = await this.prisma.role.findUniqueOrThrow({
      where: { id },
      select: {
        ...abilityFields(ability, Action.Read, Role, this.fields),
      },
    });

    return plainToInstance(Role, response);
  }

  async update(
    userReq: PayloadDto,
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const ability = this.abilityFactory.createForUser(userReq);
    const allowedFields = abilityFields(
      ability,
      Action.Update,
      Role,
      this.fields,
    );

    for (const [field] of Object.entries(updateRoleDto)) {
      if (!allowedFields[field]) {
        throw new HttpException(
          `You are not allowed to update the field: ${field}`,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const response = await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });

    return plainToInstance(Role, response);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<Role> {
    const response = await this.prisma.role.update({
      where: { id, deletedAt: { not: null } },
      data: { deletedAt: null },
    });

    if (!response) {
      throw new HttpException(
        'Role not found or not soft deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToInstance(Role, response);
  }
}
