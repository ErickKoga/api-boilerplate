import { Exclude, Transform } from 'class-transformer';
import { IsEmail, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { toTitleCase } from 'src/helpers/title-case';

export class CreateUserDto {
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
}
