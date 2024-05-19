import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppSubjects = 'all' | Subjects<{ User: User; Role: Role }>;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class AbilityFactory {
  createForUser(user: any) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    can(Action.Create, 'User');
    if (user.role === 'Administrator') {
      can(Action.Manage, 'all');
    } else {
      // User rules
      can(Action.Read, 'User', ['id', 'email', 'name', 'roleId']);
      can(Action.Update, 'User', ['email', 'name'], { id: user.id });
      can(Action.Delete, 'User', { id: user.id });

      // Role rules
      can(Action.Read, 'Role', ['id', 'name']);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor.name as ExtractSubjectType<AppSubjects>,
    });
  }
}
