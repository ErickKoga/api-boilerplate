import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LoginDto {
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
}
