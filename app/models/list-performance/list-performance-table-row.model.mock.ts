import * as Chance from 'chance';
import { ListPerformanceTableRow } from './list-performance-table-row.model';

const chance = new Chance();

export function getListPerformanceTableRowMock(length: number) {
  let rows: Array<ListPerformanceTableRow> = Array<ListPerformanceTableRow>();

  for (let i = 0 ; i < length ; i++) {
    const depDate = chance.date({string: true, american: false});
    rows.push({
      descriptionRow0: chance.string(),
      descriptionRow0Sub1: `${chance.address({short_suffix: true})} ${chance.city()} ${chance.state()}  ${chance.zip()}`,
      descriptionRow1: chance.string(),
      descriptionRow2: chance.character({pool: 'ABC'}),
      metricColumn0: chance.integer({min: 0, max: 40000}),
      metricColumn1: chance.integer({min: -40000, max: 40000}),
      metricColumn2: chance.d100(),
      metricColumn3: chance.integer({min: 0, max: 40000}),
      metricColumn4: chance.integer({min: -40000, max: 40000}),
      metricColumn5: chance.d100(),
      depletionDate: depDate.toString(),
      checked: false
    });
  }

  return rows;
}

export function getListPerformanceHeaderRowMock(): Array<string> {
  return ['Store', 'Distributor', 'Segment', 'Depeletions', ' Effective POD', 'Last Depletion'];
}
