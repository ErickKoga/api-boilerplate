import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleFilterDto } from './dto/role-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findMany(@Query() roleFilterDto: RoleFilterDto): Promise<Role[]> {
    return this.rolesService.findMany(roleFilterDto);
  }

  @Get('find')
  findFirst(@Query() roleFilterDto: RoleFilterDto): Promise<Role> {
    return this.rolesService.findFirst(roleFilterDto);
  }

  @Get(':id')
  findUnique(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findUnique(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.delete(id);
  }
}
