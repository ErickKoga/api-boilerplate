import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { toTitleCase } from 'src/helpers/title-case';

export class RegisterDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32, {
    message: 'The password must have between 8 and 32 characters.',
  })
  @Matches(/[a-zA-Z]/, {
    message: 'The password must contain at least one letter.',
  })
  @Matches(/\d/, {
    message: 'The password must contain at least one number.',
  })
  password: string;

  @Transform(({ value }) => toTitleCase(value))
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
