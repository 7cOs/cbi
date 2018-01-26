import { sample } from 'lodash';

import { DistributionTypeValue } from './distribution-type.enum';

const distributionTypeValues = Object.keys(DistributionTypeValue).map(key => DistributionTypeValue[key]);

export function getDistributionTypeValueMock(): DistributionTypeValue {
  return sample(distributionTypeValues);
}
