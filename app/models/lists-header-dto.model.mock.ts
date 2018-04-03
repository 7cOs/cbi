import * as Chance from 'chance';
import { ListHeaderInfoDTO } from './lists-header-dto.model';

let chance = new Chance();

export function getListHeaderInfoDTOMock(): ListHeaderInfoDTO {
  return {
    archived: chance.bool(),
    category: chance.string(),
    collaboratorType: chance.string(),
    collaborators: [{
      employeeId: chance.string(),
      firstName: chance.string(),
      lastName: chance.string()
    }],
    createdOn: chance.string(),
    description: chance.string(),
    id: chance.floating(),
    name: chance.string(),
    numberOfAccounts: chance.floating(),
    owner: {
      employeeId: chance.string(),
      firstName: chance.string(),
      lastName: chance.string()
    },
    survey: {
      sfid: chance.string(),
      name: chance.string()
    },
    type: chance.floating(),
    updatedOn: chance.string()
  };
}
