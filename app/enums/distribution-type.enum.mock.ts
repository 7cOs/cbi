import * as Chance from 'chance';

import { DistributionTypeValue } from './distribution-type.enum';

let chance = new Chance();
const distributionTypeValueValues = Object.keys(DistributionTypeValue)
  .map(key => DistributionTypeValue[key]);

export function getDistributionTypeValue(): DistributionTypeValue {
  return distributionTypeValueValues[chance.integer({min: 0, max: distributionTypeValueValues.length - 1})];
}
