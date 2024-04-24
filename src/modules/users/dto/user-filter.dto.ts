import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UserFilterDto extends PartialType(
  PickType(User, ['email', 'name'] as const),
) {}
