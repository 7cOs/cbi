import { ProductMetrics, ProductMetricsDTO, ProductMetricsValues, ProductMetricsValuesDTO } from './product-metrics.model';

const chance = new Chance();

export const productMetricsBrandDTOMock: ProductMetricsDTO = {
  type: 'volume',
  brandValues: [
    {
      values: [
        {
          current: chance.natural(),
          yearAgo: chance.natural(),
          collectionMethod: 'RAD'
        }
      ],
      operatingCompanyCode: '101',
      operatingCompanyDescription: 'CROWN IMPORTS',
      beverageTypeCode: '101',
      beverageTypeDescription: 'Beer',
      brandCode: '994',
      brandDescription: 'CORONA FAMILIAR',
      varietalCode: '999',
      varietalDescription: 'N/A'
    },
    {
      values: [
        {
          current: chance.natural(),
          yearAgo: chance.natural(),
          collectionMethod: 'RAD'
        }
      ],
      operatingCompanyCode: '101',
      operatingCompanyDescription: 'CROWN IMPORTS',
      beverageTypeCode: '101',
      beverageTypeDescription: 'Beer',
      brandCode: '700',
      brandDescription: 'CERVEZAS CLASICAS',
      varietalCode: '999',
      varietalDescription: 'N/A'
    }
  ]
};

export function getProductMetricsDTOBrandMock(min: number = 1, max: number = 9): ProductMetricsDTO {
  return {
    type: 'volume',
    brandValues: Array(chance.natural({min: min, max: max})).fill('').map(() => this.getProductMetricsBrandValuesDTOMock())
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

export function getProductMetricsSkuValuesDTOMock(): ProductMetricsValuesDTO {
  return {
    values: [
      {
        current: chance.natural(),
        yearAgo: chance.natural(),
        collectionMethod: chance.string()
      }
    ],
    beerId: {
      masterPackageSKUCode: chance.string(),
      masterPackageSKUDescription: chance.string()
    },
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

export function getProductMetricsSkuMock(): ProductMetricsValues {
  return {
    brandDescription: chance.string(),
    current: chance.natural(),
    yearAgo: chance.natural(),
    collectionMethod: chance.string(),
    yearAgoPercent: chance.natural(),
    brandCode: chance.string(),
    beerId: {
      masterPackageSKUDescription: chance.string(),
      masterSKUDescription: chance.string(),
    }
  };
}

export function getProductMetricsWithBrandValuesMock(min: number = 9, max: number = 9): ProductMetrics {
  return {
    brandValues: Array(chance.natural({min: min, max: max})).fill('').map(() => getProductMetricsBrandMock())
  };
}

export function getProductMetricsWithSkuValuesMock(min: number = 9, max: number = 9): ProductMetrics {
  return {
    skuValues: Array(chance.natural({min: min, max: max})).fill('').map(() => getProductMetricsSkuMock())
  };
}
