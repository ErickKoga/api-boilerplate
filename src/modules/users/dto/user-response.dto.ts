import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UserResponseDto extends PartialType(
  PickType(User, [
    'id',
    'email',
    'name',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ] as const),
) {}
