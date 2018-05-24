import { BeerDistributors } from './beer-distributors.model';

export interface StoreDetails {
  address: string;
  city: string;
  name: string;
  number: string;
  postalCode: string;
  unversionedStoreId: string;
  premiseType: string;
  state: string;
  distributor: string;
  segmentCode: string;
  beerDistributors: BeerDistributors[];
}
