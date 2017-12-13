import * as Chance from 'chance';

import { OpportunityCountDTO } from './opportunity-count-dto.model';

const chance = new Chance();

export function getOpportunityCountDTOMock(): OpportunityCountDTO {
  return {
    type: 'brand_cd_s',
    label: chance.string(),
    count: chance.natural(),
    items: Array(chance.natural({min: 1, max: 3})).fill('').map(() => {
      return {
        type: 'master_pkg_sku_cd_s',
        label: chance.string(),
        count: chance.natural(),
        items: Array(chance.natural({min: 1, max: 3})).fill('').map(() => {
          return {
            type: 'opp_type_s',
            label: chance.string(),
            count: chance.natural(),
            items: []
          };
        })
      };
    })
  };
}

export function getOpportunityCountDTOsMock(): Array<OpportunityCountDTO> {
  return Array(chance.natural({min: 1, max: 3})).fill('').map(() => getOpportunityCountDTOMock());
}
