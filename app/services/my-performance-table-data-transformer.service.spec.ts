import { inject, TestBed } from '@angular/core/testing';

import { ActionStatus } from '../enums/action-status.enum';
import { Performance } from '../models/performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { getPerformanceMock } from '../models/performance.model.mock';
import { getEntitiesWithPerformancesMock,
         getEntitiesWithPerformancesOpenPositionMock } from '../models/entity-with-performance.model.mock';
import { getProductMetricsWithBrandValuesMock } from '../models/product-metrics.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { MyPerformanceTableRow, MyPerformanceTableRowMetadata } from '../models/my-performance-table-row.model';
import { ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsState } from '../state/reducers/product-metrics.reducer';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let performanceMock: Performance;
  let responsibilityEntitiesPerformanceMock: EntityWithPerformance[];
  let responsibilityEntitiesPerformanceOpenPositionMock: EntityWithPerformance[];
  let total: number;
  let openPositionsTotal: number;

  const productMetricsState: ProductMetricsState = {
    status: ActionStatus.Fetched,
    products: getProductMetricsWithBrandValuesMock(1, 9)
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
        total = 0;
        responsibilityEntitiesPerformanceMock.forEach((entity: EntityWithPerformance) => {
          total += entity.performance.total;
        });
        openPositionsTotal = 0;
        responsibilityEntitiesPerformanceOpenPositionMock.forEach((entity: EntityWithPerformance) => {
          openPositionsTotal += entity.performance.total;
        });
    }));

    it('should return formatted ResponsibilityEntityPerformance data for all type excepting roleGroup/distributor/subaccount', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const entityTypeValues = Object.keys(EntityType).map(key => EntityType[key]);

      entityTypeValues.splice(entityTypeValues.indexOf(EntityType.RoleGroup), 1);
      entityTypeValues.splice(entityTypeValues.indexOf(EntityType.Distributor), 1);
      entityTypeValues.splice(entityTypeValues.indexOf(EntityType.SubAccount), 1);
      entityTypeValues.splice(entityTypeValues.indexOf(EntityType.AccountGroup), 1);

      responsibilityEntitiesPerformanceMock[0].entityType = entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})];

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: Math.round((responsibilityEntitiesPerformanceMock[0].performance.total / total) * 1000) / 10,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityName: responsibilityEntitiesPerformanceMock[0].name
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
        ctv: Math.round((responsibilityEntitiesPerformanceMock[0].performance.total / total) * 1000) / 10,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityName: responsibilityEntitiesPerformanceMock[0].name
        },
        performanceError: false
      };

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual(expectedRow);
    });

    it('should return formatted ResponsibilityEntityPerformance data for subAccount', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.SubAccount;

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        descriptionRow1: 'GO TO DASHBOARD',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: Math.round((responsibilityEntitiesPerformanceMock[0].performance.total / total) * 1000) / 10,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityName: responsibilityEntitiesPerformanceMock[0].name
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
      responsibilityEntitiesPerformanceMock[0].name = 'ON PREM DIRECTOR';

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: 'ON PREM DIRECTORS',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: Math.round((responsibilityEntitiesPerformanceMock[0].performance.total / total) * 1000) / 10,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityName: responsibilityEntitiesPerformanceMock[0].name
        },
        performanceError: false
      };

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual(expectedRow);
    });

    it('should return formatted ResponsibilityEntityPerformance data for AccountGroup', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.AccountGroup;
      responsibilityEntitiesPerformanceMock[0].name = 'ACCOUNT';

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: 'ACCOUNTS',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: Math.round((responsibilityEntitiesPerformanceMock[0].performance.total / total) * 1000) / 10,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityName: responsibilityEntitiesPerformanceMock[0].name
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
        ctv: Math.round((responsibilityEntitiesPerformanceMock[0].performance.total / total) * 1000) / 10,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId,
          contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
          entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
          entityType: responsibilityEntitiesPerformanceMock[0].entityType,
          entityName: responsibilityEntitiesPerformanceMock[0].name
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
          descriptionRow1: ( responsibilityEntitiesPerformanceOpenPositionMock[i].entityType === EntityType.Distributor ||
                          responsibilityEntitiesPerformanceOpenPositionMock[i].entityType === EntityType.SubAccount )
            ? 'GO TO DASHBOARD'
            : responsibilityEntitiesPerformanceOpenPositionMock[i].positionDescription,
          metricColumn0: responsibilityEntitiesPerformanceOpenPositionMock[i].performance.total,
          metricColumn1: responsibilityEntitiesPerformanceOpenPositionMock[i].performance.totalYearAgo,
          metricColumn2: responsibilityEntitiesPerformanceOpenPositionMock[i].performance.totalYearAgoPercent,
          ctv: Math.round((responsibilityEntitiesPerformanceOpenPositionMock[i].performance.total / openPositionsTotal) * 1000) / 10,
          metadata: {
            positionId: responsibilityEntitiesPerformanceOpenPositionMock[i].positionId,
            entityType: responsibilityEntitiesPerformanceOpenPositionMock[i].entityType,
            entityName: responsibilityEntitiesPerformanceOpenPositionMock[0].name
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
        descriptionRow1: ( responsibilityEntitiesPerformanceOpenPositionMock[0].entityType === EntityType.Distributor ||
                        responsibilityEntitiesPerformanceOpenPositionMock[0].entityType === EntityType.SubAccount )
          ? 'GO TO DASHBOARD'
          : responsibilityEntitiesPerformanceOpenPositionMock[0].positionDescription,
        metricColumn0: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceOpenPositionMock[0].performance.totalYearAgoPercent,
        ctv: Math.round((responsibilityEntitiesPerformanceOpenPositionMock[0].performance.total / openPositionsTotal) * 1000) / 10,
        metadata: {
          positionId: responsibilityEntitiesPerformanceOpenPositionMock[0].positionId,
          entityType: responsibilityEntitiesPerformanceOpenPositionMock[0].entityType,
          entityName: responsibilityEntitiesPerformanceOpenPositionMock[0].name
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

    it('returned table entities should contain alternateHierarchyId in their metadata if the EntityWithPerformance' +
    'contained a alternateHierarchyId', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const alternateHierarchyIdMock = chance.string();
      responsibilityEntitiesPerformanceMock[0].alternateHierarchyId = alternateHierarchyIdMock;

      let actualMetaData: MyPerformanceTableRowMetadata =
        myPerformanceTableDataTransformerService.getLeftTableData([responsibilityEntitiesPerformanceMock[0]])[0].metadata;
      let expectedMetaData: MyPerformanceTableRowMetadata = {
        positionId: responsibilityEntitiesPerformanceMock[0].positionId,
        contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
        entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
        entityType: responsibilityEntitiesPerformanceMock[0].entityType,
        entityName: responsibilityEntitiesPerformanceMock[0].name,
        alternateHierarchyId: alternateHierarchyIdMock
      };

      expect(actualMetaData).toEqual(expectedMetaData);

      delete responsibilityEntitiesPerformanceMock[0].alternateHierarchyId;

      actualMetaData = myPerformanceTableDataTransformerService.getLeftTableData([responsibilityEntitiesPerformanceMock[0]])[0].metadata;
      expectedMetaData = {
        positionId: responsibilityEntitiesPerformanceMock[0].positionId,
        contextPositionId: responsibilityEntitiesPerformanceMock[0].contextPositionId,
        entityTypeCode: responsibilityEntitiesPerformanceMock[0].entityTypeCode,
        entityType: responsibilityEntitiesPerformanceMock[0].entityType,
        entityName: responsibilityEntitiesPerformanceMock[0].name
      };

      expect(actualMetaData).toEqual(expectedMetaData);
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
        ctv: 100
      });
    });
  });

  describe('myPerformanceRightTableData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
      }));

    it('should return properly formatted table data for ProductMetrics', () => {
      const transformedProductMetricsData =
        myPerformanceTableDataTransformerService.getRightTableData(productMetricsState.products);

      expect(transformedProductMetricsData).toBeDefined();
      expect(transformedProductMetricsData.length).toBeTruthy();
      expect(transformedProductMetricsData[0].descriptionRow0).toEqual(productMetricsState.products.brandValues[0].brandDescription);
    });

    it('should calculate ctv based on total of provided rows,', () => {
      total = 0;
      productMetricsState.products.brandValues.forEach((metric: ProductMetricsValues) => {
        total += metric.current;
      });

      const transformedProductMetricsData =
        myPerformanceTableDataTransformerService.getRightTableData(productMetricsState.products);

      expect(transformedProductMetricsData.length).toBe(productMetricsState.products.brandValues.length);
      for (let i = 0; i < transformedProductMetricsData.length; i++) {
        const expectedCTV: number = Math.round((productMetricsState.products.brandValues[i].current / total) * 1000) / 10;
        expect(transformedProductMetricsData[i].ctv).toBe(expectedCTV);
      }
    });
  });
});
