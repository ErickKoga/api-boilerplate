import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleFilterDto } from './dto/role-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { PoliciesGuard } from '../authorization/policies.guard';
import { CheckPolicies } from '../authorization/check-policies.decorator';
import { Action, AppAbility } from '../authorization/ability.factory';
import { PayloadDto } from '../auth/dto/payload.dto';

@UseGuards(PoliciesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'Role'))
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Role'))
  findMany(
    @Req() req: Request & { user: PayloadDto },
    @Query() roleFilterDto: RoleFilterDto,
  ): Promise<Role[]> {
    return this.rolesService.findMany(req.user, roleFilterDto);
  }

  @Get('find')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Role'))
  findFirst(
    @Req() req: Request & { user: PayloadDto },
    @Query() roleFilterDto: RoleFilterDto,
  ): Promise<Role> {
    return this.rolesService.findFirst(req.user, roleFilterDto);
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Role'))
  findUnique(
    @Req() req: Request & { user: PayloadDto },
    @Param('id') id: string,
  ): Promise<Role> {
    return this.rolesService.findUnique(req.user, id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Role'))
  update(
    @Req() req: Request & { user: PayloadDto },
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(req.user, id, updateRoleDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Role'))
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.delete(id);
  }
}
