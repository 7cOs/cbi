import { ListStorePerformance } from './list-store-performance.model';

export interface ListPerformance {
  current: number;
  currentSimple: number;
  yearAgo: number;
  yearAgoSimple: number;
  storePerformance: ListStorePerformance[];
}
