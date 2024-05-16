import { PartialType, PickType } from '@nestjs/mapped-types';
import { Role } from '../entities/role.entity';
import { IsBoolean, IsOptional } from 'class-validator';

export class RoleFilterDto extends PartialType(
  PickType(Role, ['name'] as const),
) {
  @IsOptional()
  @IsBoolean()
  withDeleted?: boolean;
}
