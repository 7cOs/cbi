import { inject, TestBed } from '@angular/core/testing';

import { ActionStatus } from '../enums/action-status.enum';
import { Performance } from '../models/performance.model';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { getPerformanceMock } from '../models/performance.model.mock';
import {
  getEntitiesWithPerformancesMock,
  getEntitiesWithPerformancesOpenPositionMock
} from '../models/entity-with-performance.model.mock';
import { getProductMetricMock } from '../models/entity-product-metrics-dto.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { ProductMetricsState } from '../state/reducers/product-metrics.reducer';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let performanceMock: Performance;
  let responsibilityEntitiesPerformanceMock: EntityWithPerformance[];
  let responsibilityEntitiesPerformanceOpenPositionMock: EntityWithPerformance[];

  const productMetricsState: ProductMetricsState = {
    status: ActionStatus.Fetched,
    products: getProductMetricMock()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyPerformanceTableDataTransformerService
      ]
    });
  });

  describe('getLeftTableData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
        responsibilityEntitiesPerformanceMock = getEntitiesWithPerformancesMock();
        responsibilityEntitiesPerformanceOpenPositionMock = getEntitiesWithPerformancesOpenPositionMock();
    }));

    it('should return formatted ResponsibilityEntityPerformance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const tableData =  myPerformanceTableDataTransformerService.getLeftTableData(responsibilityEntitiesPerformanceMock);

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual({
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId
        },
        performanceError: false
      });
    });

    it('should return formatted ResponsibilityEntityPerformance data with performanceError value', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].performance.error = true;
      const tableData =  myPerformanceTableDataTransformerService.getLeftTableData(responsibilityEntitiesPerformanceMock);

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual({
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId
        },
        performanceError: true
      });
    });

    it('should return formatted ResponsibilityEntityPerformance data with Open Position', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const tableData =  myPerformanceTableDataTransformerService.getLeftTableData(responsibilityEntitiesPerformanceOpenPositionMock);

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual({
        descriptionRow0: 'Open Position',
        descriptionRow1: 'Best job on earth',
        metricColumn0: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceOpenPositionMock[0].positionId
        },
        performanceError: false
      });
    });
  });

  describe('getTotalRowData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
        performanceMock = getPerformanceMock();
    }));

    it('should return a formatted total row from total performance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getTotalRowData').and.callThrough();

      const performanceRowData = myPerformanceTableDataTransformerService.getTotalRowData(performanceMock);

      expect(performanceRowData).toEqual({
        descriptionRow0: 'Total',
        metricColumn0: performanceMock.total,
        metricColumn1: performanceMock.totalYearAgo,
        metricColumn2: performanceMock.totalYearAgoPercent,
        ctv: performanceMock.contributionToVolume
      });
    });
  });

  describe('myPerformanceRightTableData', () => {
    it('should return properly formatted table data for ProductMetrics', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getRightTableData').and.callThrough();

      const transformedProductMetricsData =
        myPerformanceTableDataTransformerService.getRightTableData(productMetricsState.products);

      expect(transformedProductMetricsData).toBeDefined();
      expect(transformedProductMetricsData.length).toBeTruthy();
      expect(transformedProductMetricsData[0].descriptionRow0).toEqual(productMetricsState.products.brand[0].brandDescription);
    });
  });
});
