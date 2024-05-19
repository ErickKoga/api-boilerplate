import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  @IsUUID()
  sub: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
