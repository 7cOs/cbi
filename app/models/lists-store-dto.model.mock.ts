import * as Chance from 'chance';
import { StoreListDTO } from './lists-store-dto.model';

let chance = new Chance();

export function getStoreListsDTOMock(): StoreListDTO[] {
  return Array(chance.natural({min: 1, max: 3})).fill('').map(() => getStoreDTOMock());
}

export function getStoreDTOMock(): StoreListDTO {
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
