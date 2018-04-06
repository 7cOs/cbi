import * as Chance from 'chance';
import { StoreDetailsRow } from './lists.model';

let chance = new Chance();

export function getStoreListsMock(): StoreDetailsRow[] {
  return Array(chance.natural({min: 1, max: 3})).fill('').map(() => getStoreMock());
}

export function getStoreMock(): StoreDetailsRow {
  return {
    address: chance.string(),
    city: chance.string(),
    name: chance.string(),
    number: chance.string(),
    postalCode: chance.string(),
    premiseType: chance.string(),
    state: chance.string(),
    distributor: chance.string(),
    segmentCode: chance.string()
  };
}
