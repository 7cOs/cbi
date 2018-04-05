import { MyPerformanceColumnType } from '../enums/my-performance-column-type.enum';
import { ListPerformanceColumnType } from '../enums/list-performance-column-types.enum';

export interface SortingCriteria {
  columnType: MyPerformanceColumnType | ListPerformanceColumnType;
  ascending: boolean;
}
