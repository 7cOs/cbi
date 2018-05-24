import * as Chance from 'chance';

import { BeerDistributors } from './beer-distributors.model';
import { generateRandomSizedArray } from '../util.model';

const chance = new Chance();

export function getBeerDistributorsArrayMock(): BeerDistributors[] {
  return generateRandomSizedArray().map(() => getBeerDistributorsMock());
}

export function getBeerDistributorsMock(): BeerDistributors {
  return {
    distributorCode: chance.string(),
    salespersonName: chance.string(),
    distributorCustomerCode: chance.string(),
    isPrimary: false
  };
}
