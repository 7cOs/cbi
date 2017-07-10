import { ColumnType } from '../enums/column-type.enum';

export interface SortingCriteria {
  columnType: ColumnType;
  ascending: boolean;
}
