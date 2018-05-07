import { FormattedNewList, ListsCollectionSummary } from '../models/lists/lists.model';
import { getFormattedNewList, getListsCollectionSummaryMock } from '../models/lists/lists.model.mock';

export const listsTransformerServiceMock = {
  formatNewList: formatNewList,
  getV2ListsSummary: getV2ListsSummary
};

function formatNewList(...args: any[]): FormattedNewList  {
  return getFormattedNewList();
}

function getV2ListsSummary(...args: any[]): ListsCollectionSummary {
  return getListsCollectionSummaryMock();
}
