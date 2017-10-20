import { inject, TestBed } from '@angular/core/testing';

import { ActionStatus } from '../enums/action-status.enum';
import { Performance } from '../models/performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { getPerformanceMock } from '../models/performance.model.mock';
import { getEntitiesWithPerformancesMock } from '../models/entity-with-performance.model.mock';
import { getProductMetricMock } from '../models/entity-product-metrics-dto.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { MyPerformanceTableRow, MyPerformanceTableRowMetadata } from '../models/my-performance-table-row.model';
import { ProductMetricsState } from '../state/reducers/product-metrics.reducer';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let performanceMock: Performance;
  let responsibilityEntitiesPerformanceMock: EntityWithPerformance[];

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
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: 0,
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
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        descriptionRow1: 'GO TO DASHBOARD',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: 0,
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
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        descriptionRow1: 'GO TO DASHBOARD',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: 0,
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
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: 'ON PREM DIRECTORS',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: 0,
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
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: 'ACCOUNTS',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: 0,
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
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      const expectedRow: MyPerformanceTableRow = {
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        descriptionRow1: 'GO TO DASHBOARD',
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performance.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performance.totalYearAgoPercent,
        ctv: 0,
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

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Person;
      responsibilityEntitiesPerformanceMock[0].positionDescription = chance.string();
      responsibilityEntitiesPerformanceMock[0].name = 'Open';

      responsibilityEntitiesPerformanceMock[1].entityType = EntityType.Person;
      responsibilityEntitiesPerformanceMock[1].positionDescription = chance.string();
      responsibilityEntitiesPerformanceMock[1].name = 'Open';

      responsibilityEntitiesPerformanceMock[2].entityType = EntityType.Person;
      delete responsibilityEntitiesPerformanceMock[2].positionDescription;
      responsibilityEntitiesPerformanceMock[2].name = 'Open';

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      expect(tableData.length).toBe(responsibilityEntitiesPerformanceMock.length);
      for (let i = 0; i < tableData.length; i++) {
        expect(tableData[i]).toEqual({
          descriptionRow0: 'Open Position',
          descriptionRow1: responsibilityEntitiesPerformanceMock[i].positionDescription,
          metricColumn0: responsibilityEntitiesPerformanceMock[i].performance.total,
          metricColumn1: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgo,
          metricColumn2: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgoPercent,
          ctv: 0,
          metadata: {
            positionId: responsibilityEntitiesPerformanceMock[i].positionId,
            contextPositionId: responsibilityEntitiesPerformanceMock[i].contextPositionId,
            entityName: responsibilityEntitiesPerformanceMock[i].name,
            entityType: responsibilityEntitiesPerformanceMock[i].entityType,
            entityTypeCode: responsibilityEntitiesPerformanceMock[i].entityTypeCode
          },
          performanceError: false
        });
      }
    });

    it('should return formatted ResponsibilityEntityPerformance data when in Alt-Hierarchy and ViewType Person', () => {

      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Person;
      responsibilityEntitiesPerformanceMock[0].positionDescription = chance.string();

      responsibilityEntitiesPerformanceMock[1].entityType = EntityType.Person;
      responsibilityEntitiesPerformanceMock[1].positionDescription = chance.string();

      responsibilityEntitiesPerformanceMock[2].entityType = EntityType.Person;
      delete responsibilityEntitiesPerformanceMock[2].positionDescription;

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock, true);

      expect(tableData.length).toBe(responsibilityEntitiesPerformanceMock.length);
      for (let i = 0; i < tableData.length; i++) {
        expect(tableData[i]).toEqual({
          descriptionRow0: responsibilityEntitiesPerformanceMock[i].positionDescription
            ? responsibilityEntitiesPerformanceMock[i].positionDescription : 'AREA',
          descriptionRow1: responsibilityEntitiesPerformanceMock[i].name,
          metricColumn0: responsibilityEntitiesPerformanceMock[i].performance.total,
          metricColumn1: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgo,
          metricColumn2: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgoPercent,
          ctv: 0,
          metadata: {
            positionId: responsibilityEntitiesPerformanceMock[i].positionId,
            contextPositionId: responsibilityEntitiesPerformanceMock[i].contextPositionId,
            entityName: responsibilityEntitiesPerformanceMock[i].name,
            entityType: responsibilityEntitiesPerformanceMock[i].entityType,
            entityTypeCode: responsibilityEntitiesPerformanceMock[i].entityTypeCode
          },
          performanceError: false
        });
      }
    });

    it('should calculate ctv when a total is provided,', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const totalMock = chance.natural();
      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Distributor;
      responsibilityEntitiesPerformanceMock[0].performance.error = true;

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false, totalMock);

      const expectedCTV: number = Math.round((responsibilityEntitiesPerformanceMock[0].performance.total / totalMock) * 1000) / 10;

      expect(tableData[0].ctv).toBe(expectedCTV);
    });

    it('should provide 0 for ctv when no total is provided,', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Distributor;
      responsibilityEntitiesPerformanceMock[0].performance.error = true;

      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock, false);

      expect(tableData[0].ctv).toBe(0);
    });

    it('should return the correct descriptionRow1 when the property type is entity distributors', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();
      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Distributor;
      const tableData =  myPerformanceTableDataTransformerService.getLeftTableData(
        responsibilityEntitiesPerformanceMock, false);
      expect(tableData[0].descriptionRow1).toEqual('GO TO DASHBOARD');
    });

    it('returned table entities should contain alternateHierarchyId in their metadata if the EntityWithPerformance' +
    'contained a alternateHierarchyId', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const alternateHierarchyIdMock = chance.string();
      responsibilityEntitiesPerformanceMock[0].alternateHierarchyId = alternateHierarchyIdMock;

      let actualMetaData: MyPerformanceTableRowMetadata =
        myPerformanceTableDataTransformerService.getLeftTableData(
          [responsibilityEntitiesPerformanceMock[0]], false)[0].metadata;
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

      actualMetaData = myPerformanceTableDataTransformerService.getLeftTableData(
        [responsibilityEntitiesPerformanceMock[0]], false)[0].metadata;
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
