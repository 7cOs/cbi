import * as Chance from 'chance';
let chance = new Chance();

import { ViewType } from './view-type.enum';

const viewTypeValues = Object.keys(ViewType).map(key => ViewType[key]);

export function getViewTypeMock() {
  return ViewType[viewTypeValues[chance.integer({ min: 0, max: viewTypeValues.length - 1})]];
}
