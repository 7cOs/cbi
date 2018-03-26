import * as Chance from 'chance';
import { StoreHeaderInfoDTO } from './lists-store-header-dto.model';

let chance = new Chance();

export function getStoreHeaderInfoDTOMock(): StoreHeaderInfoDTO {
  return {
    archived: chance.bool(),
    category: chance.string(),
    collaboratorType: chance.string(),
    collaborators: [{
      name: chance.string(),
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
