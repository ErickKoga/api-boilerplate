import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { toTitleCase } from 'src/helpers/title-case';

export class Role {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Transform(({ value }) => toTitleCase(value))
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt: Date;

  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }
}
