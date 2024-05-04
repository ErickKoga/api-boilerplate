import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { toTitleCase } from 'src/helpers/title-case';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  @Transform(({ value }) => value.toLowerCase())
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

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => toTitleCase(value))
  name: string;
}
