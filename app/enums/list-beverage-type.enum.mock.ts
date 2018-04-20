import { sample } from 'lodash';

import { ListBeverageType } from './list-beverage-type.enum';

const listBeverageTypeValues = Object.keys(ListBeverageType);

export function getListBeverageTypeMock(): ListBeverageType {
  return sample(listBeverageTypeValues) as ListBeverageType;
}
