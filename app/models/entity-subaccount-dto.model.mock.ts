import * as Chance from 'chance';
const chance = new Chance();

import { EntitySubAccountDTO } from './entity-subaccount-dto.model';

export function getEntitySubAccountDTOMock(): EntitySubAccountDTO {
  return {
    subaccountCode: chance.string(),
    accountCode: chance.string(),
    subaccountDescription: chance.string(),
    premiseTypeCode: chance.string()
  };
}
