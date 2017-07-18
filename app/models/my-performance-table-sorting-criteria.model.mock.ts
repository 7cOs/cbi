import * as Chance from 'chance';

import { ColumnType } from '../enums/column-type.enum';
import { SortingCriteria } from './my-performance-table-sorting-criteria.model';

let chance = new Chance();

const columnTypeValues = Object.keys(ColumnType)
  .map(key => ColumnType[key])
  .filter(value => typeof value === 'number');

export function sortingCriteriaMock(length: number) {
  let criteria: Array<SortingCriteria> = Array<SortingCriteria>();

  for (let i = 0 ; i < length ; i++) {
    criteria.push({
      columnType: columnTypeValues[chance.integer({min: 0, max: columnTypeValues.length - 1})],
      ascending: chance.bool()
    });
  }

  return criteria;
}
