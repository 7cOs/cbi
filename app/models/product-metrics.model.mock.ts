import { ProductMetrics, ProductMetricsDTO, ProductMetricsValues, ProductMetricsValuesDTO } from './product-metrics.model';
import { SkuPackageType } from '../enums/sku-package-type.enum';

const chance = new Chance();

export function getProductMetricsBrandDTOMock(min: number = 2, max: number = 9): ProductMetricsDTO {
  return {
    type: 'volume',
    brandValues: Array(chance.natural({min: min, max: max})).fill('').map(() => this.getProductMetricsBrandValuesDTOMock())
  };
}

export function getProductMetricsSkuDTOMock(min: number = 2, max: number = 9): ProductMetricsDTO {
  const skuValues: ProductMetricsValuesDTO[] =
    Array(chance.natural({min: min, max: max})).fill('').map(() => this.getProductMetricsSkuValuesDTOMock(SkuPackageType.package))
      .concat(Array(chance.natural({min: min, max: max})).fill('').map(() => this.getProductMetricsSkuValuesDTOMock(SkuPackageType.sku)));

  return {
    type: 'volume',
    skuValues: skuValues
  };
}

export function getProductMetricsBrandValuesDTOMock(): ProductMetricsValuesDTO {
  return {
    values: [
      {
        current: chance.natural(),
        yearAgo: chance.natural(),
        collectionMethod: chance.string()
      }
    ],
    operatingCompanyCode: chance.string(),
    operatingCompanyDescription: chance.string(),
    beverageTypeCode: chance.string(),
    beverageTypeDescription: chance.string(),
    brandCode: chance.string(),
    brandDescription: chance.string(),
    varietalCode: chance.string(),
    varietalDescription: chance.string(),
  };
}

export function getProductMetricsSkuValuesDTOMock(type: SkuPackageType): ProductMetricsValuesDTO {
  const dto: ProductMetricsValuesDTO = {
    values: [
      {
        current: chance.natural(),
        yearAgo: chance.natural(),
        collectionMethod: chance.string()
      }
    ],
    beerId: { },
    operatingCompanyCode: chance.string(),
    operatingCompanyDescription: chance.string(),
    beverageTypeCode: chance.string(),
    beverageTypeDescription: chance.string(),
    brandCode: chance.string(),
    brandDescription: chance.string(),
    varietalCode: chance.string(),
    varietalDescription: chance.string(),
    subBrandCode: chance.string(),
    subBrandDescription: chance.string()
  };

  if (type === SkuPackageType.package) {
    dto.beerId.masterPackageSKUCode = chance.string();
    dto.beerId.masterPackageSKUDescription = chance.string();
  } else {
    dto.beerId.masterSKUCode = chance.string();
    dto.beerId.masterSKUDescription = chance.string();
  }

  return dto;
}

export function getProductMetricsBrandMock(): ProductMetricsValues {
  return {
    brandDescription: chance.string(),
    current: chance.natural(),
    yearAgo: chance.natural(),
    collectionMethod: chance.string(),
    yearAgoPercent: chance.natural(),
    brandCode: chance.string()
  };
}

export function getProductMetricsSkuMock(type: SkuPackageType): ProductMetricsValues {
  const val: ProductMetricsValues = {
    brandDescription: chance.string(),
    current: chance.natural(),
    yearAgo: chance.natural(),
    collectionMethod: chance.string(),
    yearAgoPercent: chance.natural(),
    brandCode: chance.string(),
    beerId: { }
  };

  if (type === SkuPackageType.package) {
    val.beerId.masterPackageSKUCode = chance.string();
    val.beerId.masterPackageSKUDescription = chance.string();
  } else {
    val.beerId.masterSKUCode = chance.string();
    val.beerId.masterSKUDescription = chance.string();
  }

  return val;
}

export function getProductMetricsWithBrandValuesMock(min: number = 2, max: number = 9): ProductMetrics {
  return {
    brandValues: Array(chance.natural({min: min, max: max})).fill('').map(() => getProductMetricsBrandMock())
  };
}

export function getProductMetricsWithSkuValuesMock(skuPackageType: SkuPackageType, min: number = 2, max: number = 9): ProductMetrics {
  return {
    skuValues: Array(chance.natural({min: min, max: max})).fill('').map(() => getProductMetricsSkuMock(skuPackageType))
  };
}
