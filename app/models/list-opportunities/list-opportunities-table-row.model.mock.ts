import * as Chance from 'chance';

import { getListTableDrawerRowArrayMock } from '../lists/list-table-drawer-row.model.mock';
import { ListOpportunitiesTableRow } from './list-opportunities-table-row.model';

const chance = new Chance();

export function getListOpportunitiesTableRowMock(length: number): ListOpportunitiesTableRow[] {
  let rows: Array<ListOpportunitiesTableRow> = Array<ListOpportunitiesTableRow>();

  for (let i = 0 ; i < length ; i++) {
    rows.push({
      storeColumn: chance.string(),
      storeAddressSubline: `${chance.address({short_suffix: true})} ${chance.city()} ${chance.state()}  ${chance.zip()}`,
      distributorColumn: chance.string(),
      segmentColumn: chance.character({pool: 'ABC'}),
      cytdColumn: chance.integer({min: 0, max: 40000}),
      cytdVersusYaPercentColumn: chance.d100(),
      opportunitiesColumn: chance.integer({min: 0, max: 10000}),
      opportunities: getListTableDrawerRowArrayMock(),
      performanceError: false,
      checked: false,
      expanded: false,
      storeNumber: chance.string(),
      storeCity: chance.string(),
      storeState: chance.string(),
      unversionedStoreId: chance.string()
    });
  }

  return rows;
}

export function getListOpportunitiesHeaderRowMock(): string[] {
  return ['Store', 'Distributor', 'Segment', 'Depeletions', ' Opportunities', 'Last Depletion'];
}

export function getListTrueCheckedRowMocks(performanceList: Array<ListOpportunitiesTableRow>): ListOpportunitiesTableRow[] {
  return performanceList.filter(row => {
    return row.checked === true;
  });
}

export function getListFalseCheckedRowMocks(performanceList: Array<ListOpportunitiesTableRow>): ListOpportunitiesTableRow[] {
  return performanceList.filter(row => {
    return row.checked === false;
  });
}
