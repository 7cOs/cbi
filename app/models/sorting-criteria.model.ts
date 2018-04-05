import { ColumnType } from '../enums/column-type.enum';
import { ListPerformanceColumnType } from '../enums/list-performance-column-types.enum';

export interface SortingCriteria {
  columnType: ColumnType | ListPerformanceColumnType;
  ascending: boolean;
}
