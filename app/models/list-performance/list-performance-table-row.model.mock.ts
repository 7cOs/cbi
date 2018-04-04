import * as Chance from 'chance';
import { ListPerformanceTableRow } from './list-performance-table-row.model';

const chance = new Chance();

export function getListPerformanceTableRowMock(length: number) {
  let rows: Array<ListPerformanceTableRow> = Array<ListPerformanceTableRow>();

  for (let i = 0 ; i < length ; i++) {
    rows.push({
      descriptionRow0: chance.string(),
      descriptionRow0Sub1: chance.string(),
      descriptionRow1: chance.string(),
      descriptionRow2: chance.string(),
      metricColumn0: chance.floating(),
      metricColumn1: chance.floating(),
      metricColumn2: chance.floating(),
      metricColumn3: chance.floating(),
      metricColumn4: chance.floating(),
      metricColumn5: chance.floating(),
      depletionDate: chance.string(),
      checked: false
    });
  }

  return rows;
}
