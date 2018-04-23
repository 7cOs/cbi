import { ListsOpportunities } from './lists-opportunities.model';

export interface OpportunitiesByStore {
    storeSourceCode: string;
    oppsForStore: ListsOpportunities[];
}
