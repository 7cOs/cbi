import * as Chance from 'chance';
import { StoreDetails } from './lists-store.model';
import { generateRandomSizedArray } from '../util.model';

let chance = new Chance();

export function getStoreListsMock(): StoreDetails[] {
  return generateRandomSizedArray(1, 3).map(() => getStoreMock());
}

export function getStoreMock(): StoreDetails {
  return {
    address: chance.string(),
    city: chance.string(),
    name: chance.string(),
    number: chance.string(),
    postalCode: chance.string(),
    unversionedStoreId: chance.string(),
    premiseType: chance.string(),
    state: chance.string(),
    distributor: chance.string(),
    segmentCode: chance.string()
  };
}
