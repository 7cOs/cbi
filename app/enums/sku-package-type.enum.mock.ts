import * as Chance from 'chance';
const chance = new Chance();

import { SkuPackageType } from './sku-package-type.enum';

const skuPackageTypeValues = Object.keys(SkuPackageType).map(key => SkuPackageType[key]);

export function getskuPackageTypeMock(): SkuPackageType {
  return skuPackageTypeValues[chance.integer({ min: 0, max: skuPackageTypeValues.length - 1})];
}
