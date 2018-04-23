import { ListsOpportunities } from './lists-opportunities.model';

export interface OpportunitiesByStore {
    unversionedStoreId: string;
    oppsForStore: ListsOpportunities[];
}
