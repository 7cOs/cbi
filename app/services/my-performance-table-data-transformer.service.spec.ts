import { inject, TestBed } from '@angular/core/testing';

import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { EntitiesPerformances } from '../models/entities-performances.model';
import { GroupedEntities } from '../models/grouped-entities.model';
// import { ViewType } from '../enums/view-type.enum';
import { getEntityPeopleResponsibilitiesMock } from '../models/entity-responsibilities.model.mock';
import { getViewTypeMock } from '../enums/view-type.enum.mock';
import { getEntitiesTotalPerformancesMock } from '../models/entities-total-performances.model.mock';
import { getEntitiesPerformancesMock } from '../models/entities-performances.model.mock';
import { getProductMetricMock } from '../models/entity-product-metrics-dto.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let mockPerformanceTotal: EntitiesTotalPerformances;
  let responsibilityEntitiesPerformanceMock: EntitiesPerformances[];
  let responsibilityGroupEntitiesMock: GroupedEntities;
  let viewTypeMock: string;

  const productMetricsState: any = {
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
        // responsibilityGroupEntitiesMock = getEntityPeopleResponsibilitiesMock();
        viewTypeMock = getViewTypeMock();
    }));

    it('should return formatted ResponsibilityEntityPerformance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const tableData = null; // myPerformanceTableDataTransformerService.getLeftTableData(
      //   responsibilityEntitiesPerformanceMock,
      //   responsibilityGroupEntitiesMock,
      //   viewTypeMock);

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
