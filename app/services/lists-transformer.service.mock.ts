import { FormattedNewList, V2ListSummary, ListsCollectionSummary } from '../models/lists/lists.model';
import { getFormattedNewList, getV2ListSummaryMock, getListsCollectionSummaryMock } from '../models/lists/lists.model.mock';

export const listsTransformerServiceMock = {
  formatNewList: formatNewList,
  getV2ListSummary: getV2ListSummary,
  getV2ListsSummary: getV2ListsSummary
};

function formatNewList(...args: any[]): FormattedNewList  {
  return getFormattedNewList();
}

function getV2ListSummary(...args: any[]): V2ListSummary {
  return getV2ListSummaryMock();
}

function getV2ListsSummary(...args: any[]): ListsCollectionSummary {
  return getListsCollectionSummaryMock();
}
