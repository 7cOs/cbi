import { PrimaryDistributor } from './primary-distributor.model';

export interface ListStoreDTO {
  address: string;
  cbiRecommendedSegmentCode: string;
  cbiRecommendedSegmentDescription: string;
  city: string;
  highImpactAccount_core: boolean;
  highImpactAccount_fineWine: boolean;
  highImpactAccount_spirits: boolean;
  hispanicMarketType: string;
  latitude: number;
  longitude: number;
  name: string;
  number: string;
  plannedNsvThreshold: number;
  postalCode: string;
  segmentCode: string;
  primaryBeerDistributor: PrimaryDistributor;
  premiseType: string;
  state: string;
  storeSourceCode: string;
  tdlinxChannelCode: string;
  tdlinxChannelDescription: string;
  tdlinxSubChannelCode: string;
  tdlinxSubChannelDescription: string;
  warehouseChainFlag: boolean;
  wineUnsoldAccount: boolean;
}
