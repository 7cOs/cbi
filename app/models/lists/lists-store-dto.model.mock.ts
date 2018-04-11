import * as Chance from 'chance';
import { ListStoreDTO } from './lists-store-dto.model';
import { generateRandomSizedArray } from '../util.model';

let chance = new Chance();

export function getStoreListsDTOMock(): ListStoreDTO[] {
  return generateRandomSizedArray(1, 3).map(() => getStoreDTOMock());
}

export function getStoreDTOMock(): ListStoreDTO {
  return {
    address: chance.string(),
    cbiRecommendedSegmentCode: chance.string(),
    cbiRecommendedSegmentDescription: chance.string(),
    city: chance.string(),
    highImpactAccount_core: chance.bool(),
    highImpactAccount_fineWine: chance.bool(),
    highImpactAccount_spirits: chance.bool(),
    hispanicMarketType: chance.string(),
    latitude: chance.floating(),
    longitude: chance.floating(),
    name: chance.string(),
    segmentCode: chance.string(),
    primaryBeerDistributor: {
      id: chance.string(),
      name: chance.string()
    },
    number: chance.string(),
    plannedNsvThreshold: chance.floating(),
    postalCode: chance.string(),
    premiseType: chance.string(),
    state: chance.string(),
    storeSourceCode: chance.string(),
    tdlinxChannelCode: chance.string(),
    tdlinxChannelDescription: chance.string(),
    tdlinxSubChannelCode: chance.string(),
    tdlinxSubChannelDescription: chance.string(),
    warehouseChainFlag: chance.bool(),
    wineUnsoldAccount: chance.bool()
  };
}
