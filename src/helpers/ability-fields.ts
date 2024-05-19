import { ClassConstructor } from 'class-transformer';
import {
  Action,
  AppAbility,
  AppSubjects,
} from 'src/modules/authorization/ability.factory';

const abilityFields = <T>(
  ability: AppAbility,
  action: Action,
  object: ClassConstructor<T>,
  fields: string[],
): Record<string, boolean> => {
  return fields.reduce(
    (acc, field) => {
      acc[field] = ability.can(action, object.name as AppSubjects, field);
      return acc;
    },
    {} as Record<string, boolean>,
  );
};

export default abilityFields;
