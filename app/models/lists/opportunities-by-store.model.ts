import { ListsOpportunities } from './lists-opportunities.model';

export interface OpportunitiesByStore {
  [key: string]: ListsOpportunities[];
}
