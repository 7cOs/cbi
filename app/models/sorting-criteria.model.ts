import { MyPerformanceColumnType } from '../enums/my-performance-column-type.enum';
import { ListOpportunitiesColumnType } from '../enums/list-opportunities-column-types.enum';
import { ListPerformanceColumnType } from '../enums/list-performance-column-types.enum';

export interface SortingCriteria {
  columnType: MyPerformanceColumnType | ListPerformanceColumnType | ListOpportunitiesColumnType;
  ascending: boolean;
}
