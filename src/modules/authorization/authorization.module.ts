import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AuthorizationModule {}
