import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { PayloadDto } from './dto/payload.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user: User = await this.prismaService.user.findFirstOrThrow({
      where: {
        email: email,
      },
      include: { role: true },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    if (!(await bcrypt.compare(password, user.hash))) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }

    const payload: PayloadDto = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { password, ...data } = registerDto;
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: { ...data, hash },
    });
    return plainToInstance(User, user);
  }
}
