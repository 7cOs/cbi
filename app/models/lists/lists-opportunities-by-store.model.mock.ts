import * as Chance from 'chance';

import { getListOpportunitiesMock } from './lists-opportunities.model.mock';
import { OpportunitiesByStore } from './lists-opportunities-by-store.model';

let chance = new Chance();

export function getListOpportunitiesByStoreMock(): OpportunitiesByStore {
 return {
    unversionedStoreId: chance.string(),
    oppsForStore: getListOpportunitiesMock()
 };
}
