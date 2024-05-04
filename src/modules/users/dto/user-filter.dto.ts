import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsBoolean, IsOptional } from 'class-validator';

export class UserFilterDto extends PartialType(
  PickType(User, ['email', 'name'] as const),
) {
  @IsOptional()
  @IsBoolean()
  withDeleted?: boolean;
}
