import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/database/prisma.service';
import { RoleFilterDto } from './dto/role-filter.dto';
import { Role } from './entities/role.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const response = await this.prisma.role.create({ data: createRoleDto });
    return plainToInstance(Role, response);
  }

  async findMany(roleFilterDto?: RoleFilterDto): Promise<Role[]> {
    const { withDeleted, ...data } = roleFilterDto;
    const response = await this.prisma.role.findMany({
      where: { ...data, deletedAt: withDeleted ? undefined : null },
    });

    if (!response.length) {
      throw new HttpException('No roles were found.', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(Role, response);
  }

  async findFirst(roleFilterDto: RoleFilterDto): Promise<Role> {
    const { withDeleted, ...data } = roleFilterDto;

    const response = await this.prisma.role.findFirstOrThrow({
      where: { ...data, deletedAt: withDeleted ? undefined : null },
    });

    return plainToInstance(Role, response);
  }

  async findUnique(id: string): Promise<Role> {
    const response = await this.prisma.role.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(Role, response);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
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
