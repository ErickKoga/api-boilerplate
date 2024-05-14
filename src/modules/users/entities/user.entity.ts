import { Exclude, Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { toTitleCase } from 'src/helpers/title-case';

export class User {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @Exclude({ toPlainOnly: true })
  hash: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => toTitleCase(value))
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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
