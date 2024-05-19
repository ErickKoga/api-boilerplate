import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/public.decorator';

@Public()
@Controller()
export class AppController {
  @Get()
  getHello(): boolean {
    return true;
  }
}
