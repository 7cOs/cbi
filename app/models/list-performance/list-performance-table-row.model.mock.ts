import * as Chance from 'chance';
import { ListPerformanceTableRow } from './list-performance-table-row.model';

const chance = new Chance();

export function getListPerformanceTableRowMock(length: number) {
  let rows: Array<ListPerformanceTableRow> = Array<ListPerformanceTableRow>();

  for (let i = 0 ; i < length ; i++) {
    const depDate = chance.date({string: true, american: false});
    rows.push({
      storeColumn: chance.string(),
      storeAddressSubline: `${chance.address({short_suffix: true})} ${chance.city()} ${chance.state()}  ${chance.zip()}`,
      distributorColumn: chance.string(),
      segmentColumn: chance.character({pool: 'ABC'}),
      cytdColumn: chance.integer({min: 0, max: 40000}),
      cytdVersusYaColumn: chance.integer({min: -40000, max: 40000}),
      cytdVersusYaPercentColumn: chance.d100(),
      l90Column: chance.integer({min: 0, max: 40000}),
      l90VersusYaColumn: chance.integer({min: -40000, max: 40000}),
      l90VersusYaPercentColumn: chance.d100(),
      lastDepletionDateColumn: depDate.toString(),
      performanceError: false,
      checked: false,
      storeSourceCode: chance.string()
    });
  }

  return rows;
}

export function getListPerformanceHeaderRowMock(): Array<string> {
  return ['Store', 'Distributor', 'Segment', 'Depeletions', ' Effective POD', 'Last Depletion'];
}

export function getListTrueCheckedRowMocks(performanceList: Array<ListPerformanceTableRow>): Array<ListPerformanceTableRow> {
  return performanceList.filter(row => {
    return row.checked === true;
  });
}

export function getListFalseCheckedRowMocks(performanceList: Array<ListPerformanceTableRow>): Array<ListPerformanceTableRow> {
  return performanceList.filter(row => {
    return row.checked === false;
  });
}
