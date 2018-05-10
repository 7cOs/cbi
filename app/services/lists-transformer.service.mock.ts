import { FormattedNewList } from '../models/lists/formatted-new-list.model';
import { getFormattedNewList, getListsCollectionSummaryMock, getV2ListMock } from '../models/lists/lists.model.mock';
import { ListsCollectionSummary } from '../models/lists/lists-collection-summary.model';
import { V2List } from '../models/lists/v2-list.model';

export const listsTransformerServiceMock = {
  formatNewList: formatNewList,
  getV2ListsSummary: getV2ListsSummary,
  transformV3ToV2: transformV3ToV2
};

function formatNewList(...args: any[]): FormattedNewList  {
  return getFormattedNewList();
}

function getV2ListsSummary(...args: any[]): ListsCollectionSummary {
  return getListsCollectionSummaryMock();
}

function transformV3ToV2(...args: any[]): V2List {
  return getV2ListMock();
}
