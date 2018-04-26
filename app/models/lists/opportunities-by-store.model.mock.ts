import { getListOpportunitiesMock } from './lists-opportunities.model.mock';
import { OpportunitiesByStore } from './opportunities-by-store.model';

export function getOpportunitiesByStoreMock(): OpportunitiesByStore {
  return {
    storeId:  getListOpportunitiesMock()
  };
}
