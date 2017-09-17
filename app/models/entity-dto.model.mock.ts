import { EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityDTO } from './entity-dto.model';

export function getDistributorEntityDTOMock () {
  return {
    type: EntityPropertyType.Distributor,
    id: chance.string(),
    name: chance.string()
  };
}

export function getAccountEntityDTOMock () {
  return {
    type: EntityPropertyType.Account,
    id: chance.string(),
    name: chance.string()
  };
}
