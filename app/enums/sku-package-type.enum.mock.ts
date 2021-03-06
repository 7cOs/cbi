import { sample } from 'lodash';

import { SkuPackageType } from './sku-package-type.enum';

const skuPackageTypeValues = Object.keys(SkuPackageType).map(key => SkuPackageType[key]);

export function getSkuPackageTypeMock(): SkuPackageType {
  return sample(skuPackageTypeValues);
}
