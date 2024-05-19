import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserFilterDto extends PartialType(
  PickType(User, ['email', 'name', 'roleId'] as const),
) {
  @IsOptional()
  @IsBoolean()
  withDeleted?: boolean;

  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  withRole?: boolean;
}
