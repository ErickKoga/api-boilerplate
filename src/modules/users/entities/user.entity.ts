import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsInstance,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { toTitleCase } from 'src/helpers/title-case';
import { Role } from 'src/modules/roles/entities/role.entity';

export class User {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Exclude({ toPlainOnly: true })
  hash: string;

  @Transform(({ value }) => toTitleCase(value))
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt: Date;

  @IsInstance(Role)
  @Type(() => Role)
  role: Role;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
