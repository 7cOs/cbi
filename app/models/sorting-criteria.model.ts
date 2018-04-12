import { ListPerformanceColumnType } from '../enums/list-performance-column-types.enum';
import { MyPerformanceColumnType } from '../enums/my-performance-column-type.enum';

export interface SortingCriteria {
  columnType: MyPerformanceColumnType | ListPerformanceColumnType;
  ascending: boolean;
}
