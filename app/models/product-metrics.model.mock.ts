import { ProductMetrics, ProductMetricsDTO, ProductMetricsBrandValue, ProductMetricsBrandValueDTO } from './product-metrics.model';

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

export function getProductMetricsBrandDTOMock(): ProductMetricsBrandValueDTO {
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
        varietalDescription: chance.string()
      };
}

export function getProductMetricsBrandMock(): ProductMetricsBrandValue {
  return {
    brandDescription: chance.string(),
    current: chance.natural(),
    yearAgo: chance.natural(),
    collectionMethod: chance.string(),
    yearAgoPercent: chance.natural()
  };
}

export function getProductMetricDTOMock() {
  return {
    brand: [ getProductMetricsBrandDTOMock() ]
  };
}

export function getProductMetricMock(): ProductMetrics {
  return {
    brandValues: [ getProductMetricsBrandMock() ]
  };
}
