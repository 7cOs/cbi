import * as Chance from 'chance';
import { ListHeaderDetails } from './lists.model';

let chance = new Chance();

export function getListHeaderInfoMock(): ListHeaderDetails {
  return {
    description: chance.string(),
    id: chance.floating(),
    numberOfAccounts: chance.floating(),
    name: chance.string(),
    ownerFirstName : chance.string(),
    ownerLastName : chance.string()
  };
}
