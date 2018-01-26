import * as Chance from 'chance';
import { inject, TestBed } from '@angular/core/testing';
import { Response, ResponseOptions, ResponseType } from '@angular/http';

import { ApiHelperService, BrandSkuPackageCodeParam, FilterStateParameters, ProductMetricsNotFoundData } from './api-helper.service';
import { getDateRangeTimePeriodValueMock } from '../../enums/date-range-time-period.enum.mock';
import { getDistributionTypeValueMock } from '../../enums/distribution-type.enum.mock';
import { getMetricTypeValueMock } from '../../enums/metric-type.enum.mock';
import { getPremiseTypeValueMock } from '../../enums/premise-type.enum.mock';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../models/performance.model';
import { ProductMetricsAggregationType } from '../../enums/product-metrics-aggregation-type.enum';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

const chance = new Chance();
const emptyPerformanceDTOResponse: PerformanceDTO = {
  total: 0,
  totalYearAgo: 0
};

describe('ApiHelperService', () => {
  let apiHelperService: ApiHelperService;
  let filterStateMock: MyPerformanceFilterState;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ ApiHelperService ]
  }));

  beforeEach(inject([ ApiHelperService ], (_apiHelperService: ApiHelperService) => {
    apiHelperService = _apiHelperService;
    filterStateMock = {
      metricType: getMetricTypeValueMock(),
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeValueMock()
    };
  }));

  describe('getBrandSkuPackageCodeParam', () => {
    let brandSkuCodeMock: string;

    beforeEach(() => {
      brandSkuCodeMock = chance.string();
    });

    describe('when a brandSkuCode is passed in with no skuPackageType', () => {
      it('should return a BrandSkuPackageCodeParam with a brandCode key', () => {
        const expectedParam: BrandSkuPackageCodeParam = {
          brandCode: brandSkuCodeMock
        };
        const actualParam: BrandSkuPackageCodeParam = apiHelperService.getBrandSkuPackageCodeParam(brandSkuCodeMock, undefined);

        expect(actualParam).toEqual(expectedParam);
      });
    });

    describe('when a brandSkuCode is passed in with a skuPackageType', () => {
      it('should return a BrandSkuPackageCodeParam with a masterSKU key when the SkuPackageType is a SKU', () => {
        const expectedParam: BrandSkuPackageCodeParam = {
          masterSKU: brandSkuCodeMock
        };
        const actualParam: BrandSkuPackageCodeParam = apiHelperService.getBrandSkuPackageCodeParam(brandSkuCodeMock, SkuPackageType.sku);

        expect(actualParam).toEqual(expectedParam);
      });

      it('should return a BrandSkuPackageCodeParam with a masterPackageSKU key when the skuPackageType is a Package', () => {
        const expectedParam: BrandSkuPackageCodeParam = {
          masterPackageSKU: brandSkuCodeMock
        };
        const actualParam: BrandSkuPackageCodeParam = apiHelperService.getBrandSkuPackageCodeParam(
          brandSkuCodeMock,
          SkuPackageType.package
        );

        expect(actualParam).toEqual(expectedParam);
      });
    });
  });

  describe('getHierarchyFilterStateParams', () => {
    describe('when the passed in filter state contains a distribution type', () => {
      it('should return the FilterStateParameters object with the distribution type lower cased and'
      + ' PointsOfDistribution appended to the end of it for the metricType value', () => {
        filterStateMock.distributionType = getDistributionTypeValueMock();

        const expectedParams: FilterStateParameters = {
          metricType: filterStateMock.distributionType.toLowerCase() + 'PointsOfDistribution',
          dateRangeCode: filterStateMock.dateRangeCode,
          premiseType: filterStateMock.premiseType
        };
        const actualParams: FilterStateParameters = apiHelperService.getHierarchyFilterStateParams(filterStateMock);

        expect(actualParams).toEqual(expectedParams);
      });
    });

    describe('when the passed in filter state does not contain a distribution type', () => {
      it('should return the FilterStateParameters object with the metricType containing'
      + ' a lower cased filter state metricType value', () => {
        const expectedParams: FilterStateParameters = {
          metricType: filterStateMock.metricType.toLowerCase(),
          dateRangeCode: filterStateMock.dateRangeCode,
          premiseType: filterStateMock.premiseType
        };
        const actualParams: FilterStateParameters = apiHelperService.getHierarchyFilterStateParams(filterStateMock);

        expect(actualParams).toEqual(expectedParams);
      });
    });
  });

  describe('getProductMetricsFilterStateParams', () => {
    describe('when the passed in filter state contains a distribution type', () => {
      it('should return the FilterStateParameters object with the distribution type lower cased and'
      + ' PointsOfDistribution appended to the end of it for the type value', () => {
        filterStateMock.distributionType = getDistributionTypeValueMock();

        const expectedParams: FilterStateParameters = {
          type: filterStateMock.distributionType.toLowerCase() + 'PointsOfDistribution',
          dateRangeCode: filterStateMock.dateRangeCode,
          premiseType: filterStateMock.premiseType
        };
        const actualParams: FilterStateParameters = apiHelperService.getProductMetricsFilterStateParams(filterStateMock);

        expect(actualParams).toEqual(expectedParams);
      });
    });

    describe('when the passed in filter state does not contain a distribution type', () => {
      it('should return the FilterStateParameters object with the metricType containing'
      + ' a lower cased filter state metricType value', () => {
        const expectedParams: FilterStateParameters = {
          type: filterStateMock.metricType.toLowerCase(),
          dateRangeCode: filterStateMock.dateRangeCode,
          premiseType: filterStateMock.premiseType
        };
        const actualParams: FilterStateParameters = apiHelperService.getProductMetricsFilterStateParams(filterStateMock);

        expect(actualParams).toEqual(expectedParams);
      });
    });
  });

  describe('handlePerformanceNotFoundError', () => {
    describe('when a 404 error is passed in', () => {
      it('should return a PerformanceDTO with 0`s for each value', (done) => {
        const responseMock: Response = new Response(new ResponseOptions({
          type: ResponseType.Error,
          status: 404
        }));

        apiHelperService.handlePerformanceNotFoundError(responseMock).subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(emptyPerformanceDTOResponse);
          done();
        });
      });
    });

    describe('when a non 404 error is passed in', () => {
      it('should return the error text', (done) => {
        const errorTextMock: string = chance.string();
        const responseMock: Response = new Response(new ResponseOptions({
          type: ResponseType.Error,
          status: chance.natural(),
          body: JSON.stringify(errorTextMock)
        }));

        apiHelperService.handlePerformanceNotFoundError(responseMock)
          .subscribe((response: Error) => {}, (response: Error) => {
            expect(response).toEqual(new Error(`"${ errorTextMock }"`));
            done();
          });
      });
    });
  });

  describe('handleProductMetricsNotFoundError', () => {
    describe('when a 404 error is passed in', () => {
      it('should return an object with the passed in MetricTypeValue and an empty brandValues array when the'
      + ' ProductMetricsAggregationType is Brand', (done) => {
        const responseMock: Response = new Response(new ResponseOptions({
          type: ResponseType.Error,
          status: 404
        }));
        const expectedResponse: ProductMetricsNotFoundData = {
          brandValues: [],
          type: filterStateMock.metricType
        };

        apiHelperService.handleProductMetricsNotFoundError(
          responseMock,
          ProductMetricsAggregationType.brand,
          filterStateMock.metricType
        ).subscribe(response => {
          expect(response).toEqual(expectedResponse);
          done();
        });
      });

      it('should return an object with the passed in MetricTypeValue and an empty skuValues array when the'
      + ' ProductMetricsAggregationType is SKU', (done) => {
        const responseMock: Response = new Response(new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: chance.string()
        }));
        const expectedResponse: ProductMetricsNotFoundData = {
          skuValues: [],
          type: filterStateMock.metricType
        };

        apiHelperService.handleProductMetricsNotFoundError(
          responseMock,
          ProductMetricsAggregationType.sku,
          filterStateMock.metricType
        ).subscribe(response => {
          expect(response).toEqual(expectedResponse);
          done();
        });
      });
    });

    describe('when a non 404 error is passed in', () => {
      it('should return the error text', (done) => {
        const errorTextMock: string = chance.string();
        const responseMock: Response = new Response(new ResponseOptions({
          type: ResponseType.Error,
          status: chance.natural(),
          body: JSON.stringify(errorTextMock)
        }));

        apiHelperService.handleProductMetricsNotFoundError(
          responseMock,
          ProductMetricsAggregationType.sku,
          filterStateMock.metricType
        )
        .subscribe((response: Error) => {}, (response: Error) => {
          expect(response).toEqual(new Error(`"${ errorTextMock }"`));
          done();
        });
      });
    });
  });
});
