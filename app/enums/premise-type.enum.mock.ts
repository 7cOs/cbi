import { sample } from 'lodash';

import { PremiseTypeValue } from './premise-type.enum';

const premiseTypes = Object.keys(PremiseTypeValue).map(key => PremiseTypeValue[key]);

export function getPremiseTypeValueMock(): PremiseTypeValue {
  return sample(premiseTypes);
}
