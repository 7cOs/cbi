import { inject, TestBed } from '@angular/core/testing';

import { ActionStatus } from '../enums/action-status.enum';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { EntitiesPerformances } from '../models/entities-performances.model';
import { getEntitiesTotalPerformancesMock } from '../models/entities-total-performances.model.mock';
import {
  getEntitiesPerformancesMock,
  getEntitiesPerformancesOpenPositionMock
} from '../models/entities-performances.model.mock';
import { getProductMetricMock } from '../models/entity-product-metrics-dto.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { ProductMetricsState } from '../state/reducers/product-metrics.reducer';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let mockPerformanceTotal: EntitiesTotalPerformances;
  let responsibilityEntitiesPerformanceMock: EntitiesPerformances[];
  let responsibilityEntitiesPerformanceOpenPositionMock: EntitiesPerformances[];

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
        responsibilityEntitiesPerformanceMock = getEntitiesPerformancesMock();
        responsibilityEntitiesPerformanceOpenPositionMock = getEntitiesPerformancesOpenPositionMock();
    }));

    it('should return formatted ResponsibilityEntityPerformance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const tableData =  myPerformanceTableDataTransformerService.getLeftTableData(responsibilityEntitiesPerformanceMock);

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual({
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performanceTotal.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performanceTotal.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performanceTotal.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performanceTotal.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId
        }
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
        metricColumn0: responsibilityEntitiesPerformanceOpenPositionMock[0].performanceTotal.total,
        metricColumn1: responsibilityEntitiesPerformanceOpenPositionMock[0].performanceTotal.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceOpenPositionMock[0].performanceTotal.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceOpenPositionMock[0].performanceTotal.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceOpenPositionMock[0].positionId
        }
      });
    });
  });

  describe('getTotalRowData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
        mockPerformanceTotal = getEntitiesTotalPerformancesMock();
    }));

    it('should return a formatted total row from total performance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getTotalRowData').and.callThrough();

      const performanceTotalRowData = myPerformanceTableDataTransformerService.getTotalRowData(mockPerformanceTotal);

      expect(performanceTotalRowData).toEqual({
        descriptionRow0: 'Total',
        metricColumn0: mockPerformanceTotal.total,
        metricColumn1: mockPerformanceTotal.totalYearAgo,
        metricColumn2: mockPerformanceTotal.totalYearAgoPercent,
        ctv: mockPerformanceTotal.contributionToVolume
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
