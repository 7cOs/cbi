import * as Chance from 'chance';

import { CollaboratorType } from '../../enums/lists/collaborator-type.enum';
import { FormattedNewList } from './formatted-new-list.model';
import { generateRandomSizedArray } from '../util.model';
import { ListCategory } from '../../enums/lists/list-category.enum';
import { ListType } from '../../enums/lists/list-type.enum';

const chance = new Chance();

export function getFormattedNewListMock(): FormattedNewList {
  return {
    ownerEmployeeId: chance.string(),
    collaboratorEmployeeIds: generateRandomSizedArray().map(() => chance.string()),
    name: chance.string(),
    description: chance.string(),
    archived: false,
    type: ListType.TargetList,
    category: ListCategory.Beer,
    collaboratorType: CollaboratorType.CollaborateAndInvite
  };
}
