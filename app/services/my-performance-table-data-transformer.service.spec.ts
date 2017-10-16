import { inject, TestBed } from '@angular/core/testing';

import { ActionStatus } from '../enums/action-status.enum';
import { Performance } from '../models/performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { getPerformanceMock } from '../models/performance.model.mock';
import { getEntitiesWithPerformancesMock,
         getEntitiesWithPerformancesOpenPositionMock } from '../models/entity-with-performance.model.mock';
import { getProductMetricMock } from '../models/entity-product-metrics-dto.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
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

    it('should return formatted ResponsibilityEntityPerformance data for all type excepting roleGroup/distributor', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const entityTypeValues = Object.keys(EntityType).map(key => EntityType[key]);

      entityTypeValues.splice(entityTypeValues.indexOf(EntityType.RoleGroup), 1);
      entityTypeValues.splice(entityTypeValues.indexOf(EntityType.Distributor), 1);

      responsibilityEntitiesPerformanceMock[0].entityType = entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})];

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityDescription: responsibilityEntitiesPerformanceMock[0].name
        },
        performanceError: false
      };

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual(expectedRow);
    });

    it('should return formatted ResponsibilityEntityPerformance data for distributor', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Distributor;

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        descriptionRow1: 'GO TO DASHBOARD',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityDescription: responsibilityEntitiesPerformanceMock[0].name
        },
        performanceError: false
      };

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual(expectedRow);
    });

    it('should return formatted ResponsibilityEntityPerformance data for RoleGroup', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.RoleGroup;
      responsibilityEntitiesPerformanceMock[0].name = 'ACCOUNT';

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: 'ACCOUNTS',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityDescription: responsibilityEntitiesPerformanceMock[0].name
        },
        performanceError: false
      };

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual(expectedRow);
    });

    it('should return formatted ResponsibilityEntityPerformance data with performanceError value', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Distributor;
      responsibilityEntitiesPerformanceMock[0].performance.error = true;

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        descriptionRow1: 'GO TO DASHBOARD',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityDescription: responsibilityEntitiesPerformanceMock[0].name
        },
        performanceError: true
      };

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual(expectedRow);
    });

    it('should return formatted ResponsibilityEntityPerformance data with Open Position', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceOpenPositionMock);

      expect(tableData.length).toBe(responsibilityEntitiesPerformanceOpenPositionMock.length);
      for (let i = 0; i < tableData.length; i++) {
        expect(tableData[i]).toEqual({
          descriptionRow0: 'Open Position',
          descriptionRow1: responsibilityEntitiesPerformanceOpenPositionMock[i].entityType === EntityType.Distributor
            ? 'GO TO DASHBOARD'
            : responsibilityEntitiesPerformanceOpenPositionMock[i].positionDescription,
          metricColumn0: responsibilityEntitiesPerformanceOpenPositionMock[i].performance.total,
          metricColumn1: responsibilityEntitiesPerformanceOpenPositionMock[i].performance.totalYearAgo,
          metricColumn2: responsibilityEntitiesPerformanceOpenPositionMock[i].performance.totalYearAgoPercent,
          ctv: responsibilityEntitiesPerformanceOpenPositionMock[i].performance.contributionToVolume,
          metadata: {
            positionId: responsibilityEntitiesPerformanceOpenPositionMock[i].positionId,
            entityType: responsibilityEntitiesPerformanceOpenPositionMock[i].entityType,
            entityDescription: responsibilityEntitiesPerformanceOpenPositionMock[0].name
          },
          performanceError: false
        });
      }
    });

    it('should return formatted ResponsibilityEntityPerformance data with Open Position when a positionDescription is undefined', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      delete responsibilityEntitiesPerformanceOpenPositionMock[0].positionDescription;
      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceOpenPositionMock);

      expect(tableData.length).toBe(responsibilityEntitiesPerformanceOpenPositionMock.length);
      expect(tableData[0]).toEqual({
        descriptionRow0: 'Open Position',
        descriptionRow1: responsibilityEntitiesPerformanceOpenPositionMock[0].entityType === EntityType.Distributor
          ? 'GO TO DASHBOARD'
          : responsibilityEntitiesPerformanceOpenPositionMock[0].positionDescription,
        metricColumn0: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceOpenPositionMock[0].positionId,
          entityType: responsibilityEntitiesPerformanceOpenPositionMock[0].entityType,
          entityDescription: responsibilityEntitiesPerformanceOpenPositionMock[0].name
        },
        performanceError: false
      });
    });

    it('should return the correct descriptionRow1 when the property type is entity distributors', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();
      responsibilityEntitiesPerformanceOpenPositionMock[0].entityType = EntityType.Distributor;
      const tableData =  myPerformanceTableDataTransformerService.getLeftTableData(responsibilityEntitiesPerformanceOpenPositionMock);
      expect(tableData[0].descriptionRow1).toEqual('GO TO DASHBOARD');
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
