import * as Chance from 'chance';
import { ListOpportunitiesTableRow } from './list-opportunities-table-row.model';

const chance = new Chance();

export function getListOpportunitiesTableRowMock(length: number) {
  let rows: Array<ListOpportunitiesTableRow> = Array<ListOpportunitiesTableRow>();

  for (let i = 0 ; i < length ; i++) {
    const depDate = chance.date({string: true, american: false});
    rows.push({
      storeColumn: chance.string(),
      storeAddressSubline: `${chance.address({short_suffix: true})} ${chance.city()} ${chance.state()}  ${chance.zip()}`,
      distributorColumn: chance.string(),
      segmentColumn: chance.character({pool: 'ABC'}),
      cytdColumn: chance.integer({min: 0, max: 40000}),
      cytdVersusYaPercentColumn: chance.d100(),
      opportunitiesColumn: chance.floating(),
      lastDepletionDateColumn: depDate.toString(),
      performanceError: false,
      checked: false
    });
  }

  return rows;
}

export function getListOpportunitiesHeaderRowMock(): Array<string> {
  return ['Store', 'Distributor', 'Segment', 'Depeletions', ' Opportunities', 'Last Depletion'];
}

export function getListTrueCheckedRowMocks(performanceList: Array<ListOpportunitiesTableRow>): Array<ListOpportunitiesTableRow> {
  return performanceList.filter(row => {
    return row.checked === true;
  });
}

export function getListFalseCheckedRowMocks(performanceList: Array<ListOpportunitiesTableRow>): Array<ListOpportunitiesTableRow> {
  return performanceList.filter(row => {
    return row.checked === false;
  });
}
