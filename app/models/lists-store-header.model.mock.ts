import * as Chance from 'chance';
import { Collaborators, StoreHeaderDetails } from './lists.model';

let chance = new Chance();

export function getStoreHeaderInfoMock(): StoreHeaderDetails {
  return {
    description: chance.string(),
    id: chance.floating(),
    numberOfAccounts: chance.floating(),
    name: chance.string(),
    ownerFirstName : chance.string(),
    ownerLastName : chance.string()
  };
}
