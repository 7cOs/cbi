import { inject, TestBed } from '@angular/core/testing';

import { Performance } from '../models/performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { getPerformanceMock } from '../models/performance.model.mock';
import { getEntitiesWithPerformancesMock } from '../models/entity-with-performance.model.mock';
import {
  getProductMetricsBrandMock,
  getProductMetricsWithBrandValuesMock,
  getProductMetricsWithSkuValuesMock
} from '../models/product-metrics.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { MyPerformanceTableRow, MyPerformanceTableRowMetadata } from '../models/my-performance-table-row.model';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let performanceMock: Performance;
  let responsibilityEntitiesPerformanceMock: EntityWithPerformance[];
  let total: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyPerformanceTableDataTransformerService
      ]
    });
  });

  beforeEach(inject([ MyPerformanceTableDataTransformerService ],
    (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
      myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
  }));

  describe('getLeftTableData', () => {
    beforeEach(() => {
        responsibilityEntitiesPerformanceMock = getEntitiesWithPerformancesMock();
        total = 0;
        responsibilityEntitiesPerformanceMock.forEach((entity: EntityWithPerformance) => {
          total += entity.performance.total;
        });
    });

    it('should return formatted ResponsibilityEntityPerformance data for all type excepting roleGroup/distributor/subaccount', () => {
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
        .getLeftTableData(responsibilityEntitiesPerformanceMock);

      expect(tableData.length).toBe(responsibilityEntitiesPerformanceMock.length);
      for (let i = 0; i < tableData.length; i++) {
        expect(tableData[i]).toEqual({
          descriptionRow0: 'Open Position',
          descriptionRow1: responsibilityEntitiesPerformanceMock[i].positionDescription,
          metricColumn0: responsibilityEntitiesPerformanceMock[i].performance.total,
          metricColumn1: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgo,
          metricColumn2: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgoPercent,
          ctv: Math.round((responsibilityEntitiesPerformanceMock[i].performance.total / total) * 1000) / 10,
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
      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Person;
      responsibilityEntitiesPerformanceMock[0].positionDescription = chance.string();

      responsibilityEntitiesPerformanceMock[1].entityType = EntityType.Person;
      responsibilityEntitiesPerformanceMock[1].positionDescription = chance.string();

      responsibilityEntitiesPerformanceMock[2].entityType = EntityType.Person;
      delete responsibilityEntitiesPerformanceMock[2].positionDescription;
      const alternateHierarchyIdMock = chance.string();
      const tableData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService
        .getLeftTableData(responsibilityEntitiesPerformanceMock, alternateHierarchyIdMock);

      expect(tableData.length).toBe(responsibilityEntitiesPerformanceMock.length);
      for (let i = 0; i < tableData.length; i++) {
        expect(tableData[i]).toEqual({
          descriptionRow0: responsibilityEntitiesPerformanceMock[i].positionDescription
            ? responsibilityEntitiesPerformanceMock[i].positionDescription : 'AREA',
          descriptionRow1: responsibilityEntitiesPerformanceMock[i].name,
          metricColumn0: responsibilityEntitiesPerformanceMock[i].performance.total,
          metricColumn1: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgo,
          metricColumn2: responsibilityEntitiesPerformanceMock[i].performance.totalYearAgoPercent,
          ctv: Math.round((responsibilityEntitiesPerformanceMock[i].performance.total / total) * 1000) / 10,
          metadata: {
            positionId: responsibilityEntitiesPerformanceMock[i].positionId,
            contextPositionId: responsibilityEntitiesPerformanceMock[i].contextPositionId,
            entityName: responsibilityEntitiesPerformanceMock[i].name,
            entityType: responsibilityEntitiesPerformanceMock[i].entityType,
            entityTypeCode: responsibilityEntitiesPerformanceMock[i].entityTypeCode,
            alternateHierarchyId: alternateHierarchyIdMock
          },
          performanceError: false
        });
      }
    });

    it('should return the correct descriptionRow1 when the property type is entity distributors', () => {
      responsibilityEntitiesPerformanceMock[0].entityType = EntityType.Distributor;
      const tableData =  myPerformanceTableDataTransformerService.getLeftTableData(
        responsibilityEntitiesPerformanceMock);
      expect(tableData[0].descriptionRow1).toEqual('GO TO DASHBOARD');
    });

    it('returned table entities should contain alternateHierarchyId in their metadata if the EntityWithPerformance' +
    'contained a alternateHierarchyId', () => {
      const alternateHierarchyIdMock = chance.string();
      responsibilityEntitiesPerformanceMock[0].alternateHierarchyId = alternateHierarchyIdMock;

      let actualMetaData: MyPerformanceTableRowMetadata =
        myPerformanceTableDataTransformerService.getLeftTableData(
          [responsibilityEntitiesPerformanceMock[0]])[0].metadata;
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
        [responsibilityEntitiesPerformanceMock[0]])[0].metadata;
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
    beforeEach(() => {
        performanceMock = getPerformanceMock();
    });

    it('should return a formatted total row from total performance data', () => {
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

  describe('getRightTableData', () => {
    let products: ProductMetrics;

    beforeEach(() => {
      products = Object.assign(
        getProductMetricsWithBrandValuesMock(),
        getProductMetricsWithSkuValuesMock(SkuPackageType.sku)
      );
    });

    describe('when ProductMetricsViewType is brands', () => {
      it('should return properly formatted table data for ProductMetrics', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.brands
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.brandValues.length);

        for (let i = 0; i < products.brandValues.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.brandValues[i].brandDescription);
          expect(transformedProductMetricsData[i].metadata.brandCode).toEqual(products.brandValues[i].brandCode);
        }
      });

      it('should calculate ctv based on total of provided rows,', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.brands
        );

        total = 0;
        products.brandValues.forEach((metric: ProductMetricsValues) => {
          total += metric.current;
        });

        expect(transformedProductMetricsData.length).toBe(products.brandValues.length);
        for (let i = 0; i < products.brandValues.length; i++) {
          const expectedCTV: number = Math.round((products.brandValues[i].current / total) * 1000) / 10;
          expect(transformedProductMetricsData[i].ctv).toBe(expectedCTV);
        }
      });

      it('should filter out rows with no current nor YA for ProductMetrics', () => {
        products.brandValues[0].current = 0;
        products.brandValues[0].yearAgo = 0;

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.brands
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.brandValues.length - 1);

        for (let i = 0; i < transformedProductMetricsData.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.brandValues[i + 1].brandDescription);
          expect(transformedProductMetricsData[i].metadata.brandCode).toEqual(products.brandValues[i + 1].brandCode);
        }
      });

      it('should NOT filter out rows with 0 only for current or 0 only for YA', () => {
        products.brandValues[0].current = chance.floating({min: 0.1});
        products.brandValues[0].yearAgo = 0;
        products.brandValues[1].current = 0;
        products.brandValues[1].yearAgo = chance.floating({min: 0.1});

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.brands
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.brandValues.length);

        for (let i = 0; i < transformedProductMetricsData.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.brandValues[i].brandDescription);
          expect(transformedProductMetricsData[i].metadata.brandCode).toEqual(products.brandValues[i].brandCode);
        }
      });
    });

    describe('when ProductMetricsViewType is skus and metrics are SKUs', () => {
      it('should return properly formatted table data for ProductMetrics', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        for (let i = 0; i < products.skuValues.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.skuValues[i].beerId.masterSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.sku);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(products.skuValues[i].beerId.masterSKUCode);
        }
      });

      it('should calculate ctv based on total of provided rows,', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        total = 0;
        products.skuValues.forEach((metric: ProductMetricsValues) => {
          total += metric.current;
        });

        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);
        for (let i = 0; i < products.skuValues.length; i++) {
          const expectedCTV: number = Math.round((products.skuValues[i].current / total) * 1000) / 10;
          expect(transformedProductMetricsData[i].ctv).toBe(expectedCTV);
        }
      });

      it('should filter out rows with no current nor YA for ProductMetrics', () => {
        products.skuValues[0].current = 0;
        products.skuValues[0].yearAgo = 0;

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length - 1);

        for (let i = 0; i < transformedProductMetricsData.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.skuValues[i + 1].beerId.masterSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.sku);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(products.skuValues[i + 1].beerId.masterSKUCode);
        }
      });

      it('should NOT filter out rows with 0 only for current or 0 only for YA', () => {
        products.skuValues[0].current = chance.floating({min: 0.1});
        products.skuValues[0].yearAgo = 0;
        products.skuValues[1].current = 0;
        products.skuValues[1].yearAgo = chance.floating({min: 0.1});

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        for (let i = 0; i < transformedProductMetricsData.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.skuValues[i].beerId.masterSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.sku);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(products.skuValues[i].beerId.masterSKUCode);
        }
      });
    });

    describe('when ProductMetricsViewType is skus and metrics are Packages', () => {
      beforeEach(() => {
        products = Object.assign(
          products,
          getProductMetricsWithSkuValuesMock(SkuPackageType.package)
        );
      });

      it('should return properly formatted table data for ProductMetrics', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        for (let i = 0; i < products.skuValues.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.skuValues[i].beerId.masterPackageSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.package);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(products.skuValues[i].beerId.masterPackageSKUCode);
        }
      });

      it('should calculate ctv based on total of provided rows,', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        total = 0;
        products.skuValues.forEach((metric: ProductMetricsValues) => {
          total += metric.current;
        });

        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);
        for (let i = 0; i < products.skuValues.length; i++) {
          const expectedCTV: number = Math.round((products.skuValues[i].current / total) * 1000) / 10;
          expect(transformedProductMetricsData[i].ctv).toBe(expectedCTV);
        }
      });

      it('should filter out rows with both current and YA equal to 0', () => {
        products.skuValues[0].current = 0;
        products.skuValues[0].yearAgo = 0;

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length - 1);

        for (let i = 0; i < transformedProductMetricsData.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.skuValues[i + 1].beerId.masterPackageSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.package);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(products.skuValues[i + 1].beerId.masterPackageSKUCode);
        }
      });

      it('should NOT filter out rows with 0 only for current or 0 only for YA', () => {
        products.skuValues[0].current = chance.floating({min: 0.1});
        products.skuValues[0].yearAgo = 0;
        products.skuValues[1].current = 0;
        products.skuValues[1].yearAgo = chance.floating({min: 0.1});

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        for (let i = 0; i < transformedProductMetricsData.length; i++) {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(products.skuValues[i].beerId.masterPackageSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.package);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(products.skuValues[i].beerId.masterPackageSKUCode);
        }
      });
    });
  });

  describe('getProductMetricsSelectedBrandRow', () => {
    let productMetricsValuesMock: ProductMetricsValues;

    beforeEach(() => {
        productMetricsValuesMock = getProductMetricsBrandMock();
    });

    it('should return a formatted total row from brand product metrics values', () => {
      const rowData: MyPerformanceTableRow =
        myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(productMetricsValuesMock);

      expect(rowData.descriptionRow0).toEqual(productMetricsValuesMock.brandDescription);
      expect(rowData.metricColumn0).toEqual(productMetricsValuesMock.current);
      expect(rowData.metricColumn1).toEqual(productMetricsValuesMock.yearAgo);
      expect(rowData.metricColumn2).toEqual(productMetricsValuesMock.yearAgoPercent);
      expect(rowData.ctv).toEqual(100);
    });
  });
});
