import { sample } from 'lodash';

import { PluralizedRoleGroup } from './pluralized-role-group.enum';

const pluralizedRoleGroupValues = Object.keys(PluralizedRoleGroup).map(key => PluralizedRoleGroup[key]);

export function getPluralizedRoleGroupMock(): PluralizedRoleGroup {
  return sample(pluralizedRoleGroupValues);
}
