import { getListOpportunityMock } from './lists-opportunities.model.mock';
import { OpportunitiesByStore } from './opportunities-by-store.model';

export function getOpportunitiesByStoreMock(): OpportunitiesByStore {
  const mockOne = getListOpportunityMock();
  let mockTwo = getListOpportunityMock();
  mockTwo.unversionedStoreId = mockOne.unversionedStoreId;
  const oppsArray = [];
  oppsArray.push(mockOne, mockTwo);
  return {
    [mockOne.unversionedStoreId]: oppsArray
  };
}
