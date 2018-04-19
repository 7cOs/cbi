import { MyPerformanceColumnType } from '../enums/my-performance-column-type.enum';

export interface SortingCriteria {
  columnType: MyPerformanceColumnType;
  ascending: boolean;
}
