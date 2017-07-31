import * as Chance from 'chance';

import { PremiseTypeValue } from './premise-type.enum';

let chance = new Chance();
const premiseTypeValueValues = Object.keys(PremiseTypeValue)
  .map(key => PremiseTypeValue[key]);

export function getPremiseTypeValue(): PremiseTypeValue {
  return premiseTypeValueValues[chance.integer({min: 0, max: premiseTypeValueValues.length - 1})];
}
