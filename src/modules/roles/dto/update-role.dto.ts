import { PartialType, PickType } from '@nestjs/mapped-types';
import { Role } from '../entities/role.entity';

export class UpdateRoleDto extends PartialType(PickType(Role, ['name'])) {}
