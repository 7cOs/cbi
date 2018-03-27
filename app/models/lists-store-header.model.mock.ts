import * as Chance from 'chance';
import { Collaborators, StoreHeaderDetails } from './lists.model';

let chance = new Chance();

export function getStoreHeaderInfoMock(): StoreHeaderDetails {
  return {
    collaborators: Array(chance.natural({min: 1, max: 4})).fill('').map(() => getCollaboratorMock()),
    createdOn: chance.string(),
    description: chance.string(),
    id: chance.floating(),
    numberOfAccounts: chance.floating(),
    name: chance.string(),
    ownerFirstName : chance.string(),
    ownerLastName : chance.string(),
    updatedOn: chance.string()
  };
}

export function getCollaboratorMock(): Collaborators {
  return {
    name: chance.string()
  };
}
