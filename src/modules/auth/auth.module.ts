import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/database/prisma.module';
import { AbilityFactory } from '../authorization/ability.factory';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AbilityFactory],
  exports: [AbilityFactory],
})
export class AuthModule {}
