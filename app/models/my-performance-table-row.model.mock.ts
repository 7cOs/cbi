import * as Chance from 'chance';

import { MyPerformanceTableRow } from './my-performance-table-row.model';

let chance = new Chance();

export function myPerformanceTableRowMock(length: number) {
  let rows: Array<MyPerformanceTableRow> = Array<MyPerformanceTableRow>();

  for (let i = 0 ; i < length ; i++) {
    rows.push({
      descriptionLine0: chance.string(),
      descriptionLine1: chance.string(),
      metricColumn0: chance.floating(),
      metricColumn1: chance.floating(),
      metricColumn2: chance.floating(),
      ctv: chance.natural()
    });
  }

  return rows;
}
