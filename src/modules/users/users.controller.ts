import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { CheckPolicies } from '../authorization/check-policies.decorator';
import { Action, AppAbility } from '../authorization/ability.factory';
import { PoliciesGuard } from '../authorization/policies.guard';
import { PayloadDto } from '../auth/dto/payload.dto';

@UseGuards(PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'User'))
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'User'))
  findMany(
    @Req() req: Request & { user: PayloadDto },
    @Query() userFilterDto: UserFilterDto,
  ): Promise<User[]> {
    return this.usersService.findMany(req.user, userFilterDto);
  }

  @Get('find')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'User'))
  findFirst(
    @Req() req: Request & { user: PayloadDto },
    @Query() userFilterDto: UserFilterDto,
  ): Promise<User> {
    return this.usersService.findFirst(req.user, userFilterDto);
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'User'))
  findUnique(
    @Req() req: Request & { user: PayloadDto },
    @Param('id') id: string,
  ): Promise<User> {
    return this.usersService.findUnique(req.user, id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'User'))
  update(
    @Req() req: Request & { user: PayloadDto },
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user, id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'User'))
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
