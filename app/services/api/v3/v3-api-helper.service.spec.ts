import * as Chance from 'chance';
import { getTestBed, TestBed } from '@angular/core/testing';

import { BrandSkuPackageCodeParam, FilterStateParameters, V3ApiHelperService } from './v3-api-helper.service';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getDistributionTypeValueMock } from '../../../enums/distribution-type.enum.mock';
import { getMetricTypeValueMock } from '../../../enums/metric-type.enum.mock';
import { getPremiseTypeValueMock } from '../../../enums/premise-type.enum.mock';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../../models/performance-dto.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

const chance = new Chance();
const emptyPerformanceDTOResponse: PerformanceDTO = {
  total: 0,
  totalYearAgo: 0
};

describe('V3ApiHelperService', () => {
  let testBed: TestBed;
  let v3ApiHelperService: V3ApiHelperService;

  let filterStateMock: MyPerformanceFilterState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ V3ApiHelperService ]
    });

    testBed = getTestBed();
    v3ApiHelperService = testBed.get(V3ApiHelperService);

    filterStateMock = {
      metricType: getMetricTypeValueMock(),
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeValueMock()
    };
  });

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
        const actualParam: BrandSkuPackageCodeParam = v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCodeMock, undefined);

        expect(actualParam).toEqual(expectedParam);
      });
    });

    describe('when a brandSkuCode is passed in with a skuPackageType', () => {
      it('should return a BrandSkuPackageCodeParam with a masterSKU key when the SkuPackageType is a SKU', () => {
        const expectedParam: BrandSkuPackageCodeParam = {
          masterSKU: brandSkuCodeMock
        };
        const actualParam: BrandSkuPackageCodeParam = v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCodeMock, SkuPackageType.sku);

        expect(actualParam).toEqual(expectedParam);
      });

      it('should return a BrandSkuPackageCodeParam with a masterPackageSKU key when the skuPackageType is a Package', () => {
        const expectedParam: BrandSkuPackageCodeParam = {
          masterPackageSKU: brandSkuCodeMock
        };
        const actualParam: BrandSkuPackageCodeParam = v3ApiHelperService.getBrandSkuPackageCodeParam(
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
        const actualParams: FilterStateParameters = v3ApiHelperService.getHierarchyFilterStateParams(filterStateMock);

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
        const actualParams: FilterStateParameters = v3ApiHelperService.getHierarchyFilterStateParams(filterStateMock);

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
        const actualParams: FilterStateParameters = v3ApiHelperService.getProductMetricsFilterStateParams(filterStateMock);

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
        const actualParams: FilterStateParameters = v3ApiHelperService.getProductMetricsFilterStateParams(filterStateMock);

        expect(actualParams).toEqual(expectedParams);
      });
    });
  });

  describe('handlePerformanceNotFoundError', () => {

    describe('when a 404 error is passed in', () => {
      it('should return a PerformanceDTO with 0`s for each value', (done) => {
        const httpErrorResponseMock: any = {
          status: 404,
          statusText: chance.string(),
          message: chance.string()
        };

        v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponseMock).subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(emptyPerformanceDTOResponse);
          done();
        });
      });
    });

    describe('when a non 404 error is passed in', () => {
      it('should return the HttpErrorResponse message', (done) => {
        const httpErrorResponseMock: any = {
          status: chance.natural(),
          statusText: chance.string(),
          message: chance.string()
        };

        v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponseMock)
          .subscribe(
            () => {},
            (response: Error) => {
              expect(response).toBe(httpErrorResponseMock.message);
              done();
          });
      });
    });
  });

  describe('handleProductMetricsNotFoundError', () => {

    describe('when a 404 error is passed in', () => {
      it('should return an object with the passed in MetricTypeValue and an empty brandValues array when the'
      + ' ProductMetricsAggregationType is Brand', (done) => {
        const httpErrorResponseMock: any = {
          status: 404,
          statusText: chance.string(),
          message: chance.string()
        };
        const expectedResponse: ProductMetricsDTO = {
          brandValues: [],
          type: filterStateMock.metricType
        };

        v3ApiHelperService.handleProductMetricsNotFoundError(
          httpErrorResponseMock,
          ProductMetricsAggregationType.brand,
          filterStateMock.metricType
        ).subscribe((response: ProductMetricsDTO) => {
          expect(response).toEqual(expectedResponse);
          done();
        });
      });

      it('should return an object with the passed in MetricTypeValue and an empty skuValues array when the'
      + ' ProductMetricsAggregationType is SKU', (done) => {
        const httpErrorResponseMock: any = {
          status: 404,
          statusText: chance.string(),
          message: chance.string()
        };
        const expectedResponse: ProductMetricsDTO = {
          skuValues: [],
          type: filterStateMock.metricType
        };

        v3ApiHelperService.handleProductMetricsNotFoundError(
          httpErrorResponseMock,
          ProductMetricsAggregationType.sku,
          filterStateMock.metricType
        ).subscribe((response: ProductMetricsDTO) => {
          expect(response).toEqual(expectedResponse);
          done();
        });
      });
    });

    describe('when a non 404 error is passed in', () => {
      it('should return the error text', (done) => {
        const httpErrorResponseMock: any = {
          status: chance.natural(),
          statusText: chance.string(),
          message: chance.string()
        };

        v3ApiHelperService.handleProductMetricsNotFoundError(
          httpErrorResponseMock,
          ProductMetricsAggregationType.sku,
          filterStateMock.metricType
        )
        .subscribe(
          () => {},
          (response: Error) => {
            expect(response).toBe(httpErrorResponseMock.message);
            done();
        });
      });
    });
  });
});
