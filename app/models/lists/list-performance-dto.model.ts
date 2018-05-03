import { ListStorePerformanceDTO } from './list-store-performance-dto.model';

export interface ListPerformanceDTO {
  current: number;
  currentSimple: number;
  yearAgo: number;
  yearAgoSimple: number;
  storePerformance: ListStorePerformanceDTO[];
}
