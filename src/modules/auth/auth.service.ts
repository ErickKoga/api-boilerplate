import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user: User = await this.usersService.findFirst({ email: email });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    if (user.deletedAt) {
      throw new HttpException('User account deleted.', HttpStatus.CONFLICT);
    }
    if (!(await bcrypt.compare(password, user.hash))) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { password, ...data } = registerDto;
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ ...data, hash });
    return user;
  }
}
