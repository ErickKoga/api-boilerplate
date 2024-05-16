import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsBoolean, IsOptional } from 'class-validator';

export class UserFilterDto extends PartialType(
  PickType(User, ['email', 'name', 'roleId'] as const),
) {
  @IsOptional()
  @IsBoolean()
  withDeleted?: boolean;
}
