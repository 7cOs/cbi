import { inject, TestBed } from '@angular/core/testing';
import { sample } from 'lodash';

import { EntityPeopleType, EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { getEntityPeopleTypeMock } from '../enums/entity-responsibilities.enum.mock';
import { getPerformanceMock } from '../models/performance.model.mock';
import { getEntitiesWithPerformancesMock } from '../models/entity-with-performance.model.mock';
import { getOpportunityCountMocks, getOpportunitiesGroupedByBrandSkuPackageCodeMock } from '../models/opportunity-count.model.mock';
import { getProductMetricsBrandMock,
         getProductMetricsWithBrandValuesMock,
         getProductMetricsWithSkuValuesMock } from '../models/product-metrics.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../models/opportunity-count.model';
import { Performance } from '../models/performance.model';
import { PluralizedRoleGroup } from '../enums/pluralized-role-group.enum';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';
import { SpecializedAccountName } from '../enums/specialized-account-name.enum';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let performanceMock: Performance;
  let randomIndex: number;
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
        randomIndex = chance.integer({min: 0, max: responsibilityEntitiesPerformanceMock.length - 1});
    });

    describe('when given any EntityWithPerformance', () => {
      it('should return a transformed table row with the entity`s performance data in the metric and ctv columns', () => {
        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.metricColumn0).toBe(responsibilityEntitiesPerformanceMock[i].performance.total);
          expect(row.metricColumn1).toBe(responsibilityEntitiesPerformanceMock[i].performance.totalYearAgo);
          expect(row.metricColumn2).toBe(responsibilityEntitiesPerformanceMock[i].performance.totalYearAgoPercent);
          expect(row.ctv).toBe(Math.round((responsibilityEntitiesPerformanceMock[i].performance.total / total) * 1000) / 10);
        });
      });

      it('should return a transformed table row with the entity`s performance error flag', () => {
        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.performanceError).toBe(responsibilityEntitiesPerformanceMock[i].performance.error);
        });
      });

      it('should return a transformed table row with the entity`s positionId, entityType, and name in the metadata', () => {
        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.metadata.positionId).toBe(responsibilityEntitiesPerformanceMock[i].positionId);
          expect(row.metadata.entityType).toBe(responsibilityEntitiesPerformanceMock[i].entityType);
          expect(row.metadata.entityName).toBe(responsibilityEntitiesPerformanceMock[i].name);
        });
      });

      it('should return a transformed table row with a contextPositionId in the metadata ONLY when the entity has one', () => {
        delete responsibilityEntitiesPerformanceMock[randomIndex].contextPositionId;

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          i === randomIndex
            ? expect(row.metadata.contextPositionId).toBe(undefined)
            : expect(row.metadata.contextPositionId).toBe(responsibilityEntitiesPerformanceMock[i].contextPositionId);
        });
      });

      it('should return a transformed table row with a entityTypeCode in the metadata ONLY when the entity has one', () => {
        delete responsibilityEntitiesPerformanceMock[randomIndex].entityTypeCode;

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          i === randomIndex
            ? expect(row.metadata.entityTypeCode).toBe(undefined)
            : expect(row.metadata.entityTypeCode).toBe(responsibilityEntitiesPerformanceMock[i].entityTypeCode);
        });
      });

      it('should return a transformed table row with a alternateHierarchyId in the metadata ONLY when the entity has one', () => {
        responsibilityEntitiesPerformanceMock[randomIndex].alternateHierarchyId = chance.string();

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          i === randomIndex
            ? expect(row.metadata.alternateHierarchyId).toBe(responsibilityEntitiesPerformanceMock[randomIndex].alternateHierarchyId)
            : expect(row.metadata.alternateHierarchyId).toBe(undefined);
        });
      });

      it('should return a transformed table row with exceptionHierarchy in the metadata ONLY when the entity '
      + 'has isMemberOfExceptionHierarchy', () => {
        responsibilityEntitiesPerformanceMock[randomIndex].isMemberOfExceptionHierarchy = true;

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          i === randomIndex
            ? expect(row.metadata.exceptionHierarchy).toBe(responsibilityEntitiesPerformanceMock[randomIndex].isMemberOfExceptionHierarchy)
            : expect(row.metadata.exceptionHierarchy).toBe(undefined);
        });
      });
    });

    describe('when given an EntityWithPerformance of an entityType of Person', () => {
      beforeEach(() => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.entityType = EntityType.Person;
        });
      });

      it('should return a transformed table row with the person entity`s name in the descriptionRow0', () => {
        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toBe(responsibilityEntitiesPerformanceMock[i].name);
        });
      });

      it('should return a transformed table row with `Open Position` in the descriptionrow0 and the entity`s position description in the '
      + 'descriptionRow1 when the entity`s name is `Open`', () => {
        responsibilityEntitiesPerformanceMock[randomIndex].name = 'Open';
        responsibilityEntitiesPerformanceMock[randomIndex].positionDescription = chance.string();

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          if (i === randomIndex) {
            expect(row.descriptionRow0).toBe('Open Position');
            expect(row.descriptionRow1).toBe(responsibilityEntitiesPerformanceMock[randomIndex].positionDescription);
          } else {
            expect(row.descriptionRow0).toBe(responsibilityEntitiesPerformanceMock[i].name);
            expect(row.descriptionRow1).toBe(undefined);
          }
        });
      });

      it('should return a transformed table row with the entity`s name in the descriptionRow1 and positionDescription in the '
      + 'descriptionRow0 or `AREA` if the positionDescription is missing when an alternate hierarchy id is also passed in', () => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.positionDescription = chance.string();
        });
        delete responsibilityEntitiesPerformanceMock[randomIndex].positionDescription;

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock, chance.string());

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          if (i === randomIndex) {
            expect(row.descriptionRow0).toBe('AREA');
            expect(row.descriptionRow1).toBe(responsibilityEntitiesPerformanceMock[i].name);
          } else {
            expect(row.descriptionRow0).toBe(responsibilityEntitiesPerformanceMock[i].positionDescription);
            expect(row.descriptionRow1).toBe(responsibilityEntitiesPerformanceMock[i].name);
          }
        });
      });
    });

    describe('when given an EntityWithPerformance of an entityType of RoleGroup', () => {
      beforeEach(() => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.entityType = EntityType.RoleGroup;
        });
      });

      it('should return a transformed table row with the pluralized version of the entity`s name in the descriptionRow0', () => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.name = getEntityPeopleTypeMock();
        });

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toBe(PluralizedRoleGroup[responsibilityEntitiesPerformanceMock[i].name]);
        });
      });
    });

    describe('when given an EntityWithPerformance of an entityType of AccountGroup', () => {
      beforeEach(() => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.entityType = EntityType.AccountGroup;
        });
      });

      it('should return a transformed table row with the pluralized version of the entity`s name in the descriptionRow0', () => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.name = sample([EntityPeopleType.ACCOUNT, EntityPeopleType.GEOGRAPHY]);
        });

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toBe(PluralizedRoleGroup[responsibilityEntitiesPerformanceMock[i].name]);
        });
      });
    });

    describe('when given an EntityWithPerformance of an entityType of Distributor', () => {
      beforeEach(() => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.entityType = EntityType.Distributor;
        });
      });

      it('should return a transformed table row with the entity`s name in the descriptionRow0 and '
      + '`GO TO DASHBOARD` in the descriptionRow1', () => {
        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toBe(responsibilityEntitiesPerformanceMock[i].name);
          expect(row.descriptionRow1).toBe('GO TO DASHBOARD');
        });
      });
    });

    describe('when given an EntityWithPerformance of an entityType of Account', () => {
      beforeEach(() => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.entityType = EntityType.Account;
        });
      });

      it('should return a transformed table row with the entity`s regular name in the descriptionRow0 unless '
      + 'when the entity has an edge case name', () => {
        responsibilityEntitiesPerformanceMock[randomIndex].name = 'ALL OTHER';

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          i === randomIndex
            ? expect(row.descriptionRow0).toBe(SpecializedAccountName[responsibilityEntitiesPerformanceMock[i].name])
            : expect(row.descriptionRow0).toBe(responsibilityEntitiesPerformanceMock[i].name);
        });
      });
    });

    describe('when given an EntityWithPerformance of an entityType of SubAccount', () => {
      beforeEach(() => {
        responsibilityEntitiesPerformanceMock.forEach((entityWithPerformance: EntityWithPerformance) => {
          entityWithPerformance.entityType = EntityType.SubAccount;
        });
      });

      it('should return a transformed table row with the entity`s specialized name in the descriptionRow0 and '
      + '`GO TO DASHBOARD` in the descriptionRow1 when the entity has an edge case name', () => {
        responsibilityEntitiesPerformanceMock[randomIndex].name = 'ALL OTHER';

        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          i === randomIndex
            ? expect(row.descriptionRow0).toBe(SpecializedAccountName[responsibilityEntitiesPerformanceMock[i].name])
            : expect(row.descriptionRow0).toBe(responsibilityEntitiesPerformanceMock[i].name);

          expect(row.descriptionRow1).toBe('GO TO DASHBOARD');
        });
      });

      it('should return a transformed table row with the entity`s name in the descriptionRow0 and '
      + '`GO TO DASHBOARD` in the descriptionRow1', () => {
        const tableRows: Array<MyPerformanceTableRow> = myPerformanceTableDataTransformerService
          .getLeftTableData(responsibilityEntitiesPerformanceMock);

        tableRows.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toBe(responsibilityEntitiesPerformanceMock[i].name);
          expect(row.descriptionRow1).toBe('GO TO DASHBOARD');
        });
      });
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
    let undefinedGroupedOpportunities: OpportunitiesGroupedByBrandSkuPackageCode;

    beforeEach(() => {
      products = Object.assign(
        getProductMetricsWithBrandValuesMock(),
        getProductMetricsWithSkuValuesMock(SkuPackageType.sku)
      );
      undefinedGroupedOpportunities = undefined;
    });

    describe('when ProductMetricsViewType is brands', () => {
      it('should return properly formatted table data for ProductMetrics', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.brands
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.brandValues.length);

        products.brandValues.forEach((values: ProductMetricsValues, i: number) => {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(values.brandDescription);
          expect(transformedProductMetricsData[i].metadata.brandCode).toEqual(values.brandCode);
        });
      });

      it('should calculate ctv based on total of provided rows,', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.brands
        );

        total = 0;
        products.brandValues.forEach((metric: ProductMetricsValues) => {
          total += metric.current;
        });

        expect(transformedProductMetricsData.length).toBe(products.brandValues.length);
        products.brandValues.forEach((values: ProductMetricsValues, i: number) => {
          const expectedCTV: number = Math.round((values.current / total) * 1000) / 10;
          expect(transformedProductMetricsData[i].ctv).toBe(expectedCTV);
        });
      });

      it('should filter out rows with no current nor YA for ProductMetrics', () => {
        products.brandValues[0].current = 0;
        products.brandValues[0].yearAgo = 0;

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.brands
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.brandValues.length - 1);

        transformedProductMetricsData.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toEqual(products.brandValues[i + 1].brandDescription);
          expect(row.metadata.brandCode).toEqual(products.brandValues[i + 1].brandCode);
        });
      });

      it('should NOT filter out rows with 0 only for current or 0 only for YA', () => {
        products.brandValues[0].current = chance.floating({min: 0.1});
        products.brandValues[0].yearAgo = 0;
        products.brandValues[1].current = 0;
        products.brandValues[1].yearAgo = chance.floating({min: 0.1});

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.brands
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.brandValues.length);

        products.brandValues.forEach((values: ProductMetricsValues, i: number) => {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(values.brandDescription);
          expect(transformedProductMetricsData[i].metadata.brandCode).toEqual(values.brandCode);
        });
      });
    });

    describe('when ProductMetricsViewType is skus and metrics are SKUs', () => {
      it('should return properly formatted table data for ProductMetrics', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        products.skuValues.forEach((values: ProductMetricsValues, i: number) => {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(values.beerId.masterSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.sku);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(values.beerId.masterSKUCode);
        });
      });

      it('should calculate ctv based on total of provided rows,', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        total = 0;
        products.skuValues.forEach((metric: ProductMetricsValues) => {
          total += metric.current;
        });

        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);
        products.skuValues.forEach((values: ProductMetricsValues, i: number) => {
          const expectedCTV: number = Math.round((values.current / total) * 1000) / 10;
          expect(transformedProductMetricsData[i].ctv).toBe(expectedCTV);
        });
      });

      it('should filter out rows with no current nor YA for ProductMetrics', () => {
        products.skuValues[0].current = 0;
        products.skuValues[0].yearAgo = 0;

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length - 1);

        transformedProductMetricsData.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toEqual(products.skuValues[i + 1].beerId.masterSKUDescription);
          expect(row.metadata.skuPackageType).toEqual(SkuPackageType.sku);
          expect(row.metadata.skuPackageCode).toEqual(products.skuValues[i + 1].beerId.masterSKUCode);
        });
      });

      it('should NOT filter out rows with 0 only for current or 0 only for YA', () => {
        products.skuValues[0].current = chance.floating({min: 0.1});
        products.skuValues[0].yearAgo = 0;
        products.skuValues[1].current = 0;
        products.skuValues[1].yearAgo = chance.floating({min: 0.1});

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        products.skuValues.forEach((values: ProductMetricsValues, i: number) => {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(values.beerId.masterSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.sku);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(values.beerId.masterSKUCode);
        });
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
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        products.skuValues.forEach((values: ProductMetricsValues, i: number) => {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(values.beerId.masterPackageSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.package);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(values.beerId.masterPackageSKUCode);
        });
      });

      it('should calculate ctv based on total of provided rows,', () => {
        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        total = 0;
        products.skuValues.forEach((metric: ProductMetricsValues) => {
          total += metric.current;
        });

        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);
        products.skuValues.forEach((values: ProductMetricsValues, i: number) => {
          const expectedCTV: number = Math.round((values.current / total) * 1000) / 10;
          expect(transformedProductMetricsData[i].ctv).toBe(expectedCTV);
        });
      });

      it('should filter out rows with both current and YA equal to 0', () => {
        products.skuValues[0].current = 0;
        products.skuValues[0].yearAgo = 0;

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length - 1);

        transformedProductMetricsData.forEach((row: MyPerformanceTableRow, i: number) => {
          expect(row.descriptionRow0).toEqual(products.skuValues[i + 1].beerId.masterPackageSKUDescription);
          expect(row.metadata.skuPackageType).toEqual(SkuPackageType.package);
          expect(row.metadata.skuPackageCode).toEqual(products.skuValues[i + 1].beerId.masterPackageSKUCode);
        });
      });

      it('should NOT filter out rows with 0 only for current or 0 only for YA', () => {
        products.skuValues[0].current = chance.floating({min: 0.1});
        products.skuValues[0].yearAgo = 0;
        products.skuValues[1].current = 0;
        products.skuValues[1].yearAgo = chance.floating({min: 0.1});

        const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
          products, undefinedGroupedOpportunities, ProductMetricsViewType.skus
        );

        expect(transformedProductMetricsData).toBeDefined();
        expect(transformedProductMetricsData.length).toBe(products.skuValues.length);

        products.skuValues.forEach((values: ProductMetricsValues, i: number) => {
          expect(transformedProductMetricsData[i].descriptionRow0).toEqual(values.beerId.masterPackageSKUDescription);
          expect(transformedProductMetricsData[i].metadata.skuPackageType).toEqual(SkuPackageType.package);
          expect(transformedProductMetricsData[i].metadata.skuPackageCode).toEqual(values.beerId.masterPackageSKUCode);
        });
      });
    });

    describe('when OpportunitiesGroupedByBrandSkuPackageCode are passed in', () => {
      let opportunitiesGroupedByBrandSkuPackageCodeMock: OpportunitiesGroupedByBrandSkuPackageCode;

      beforeEach(() => {
        opportunitiesGroupedByBrandSkuPackageCodeMock = getOpportunitiesGroupedByBrandSkuPackageCodeMock();
      });

      describe('when the ProductMetricsViewType is Brands', () => {
        it('should return a formatted row containing an opportunities column with the matched brandSkuPackageOpportunityCountTotal value '
        + 'from the OpportunitiesGroupedByBrandSkuPackageCode based on brandCode', () => {
          products.brandValues.forEach((product: ProductMetricsValues) => {
            opportunitiesGroupedByBrandSkuPackageCodeMock[product.brandCode] = {
              brandSkuPackageOpportunityCountTotal: chance.natural(),
              opportunityCounts: getOpportunityCountMocks()
            };
          });

          const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
            products, opportunitiesGroupedByBrandSkuPackageCodeMock, ProductMetricsViewType.brands);

          transformedProductMetricsData.forEach((tableRow: MyPerformanceTableRow, index: number) => {
            expect(tableRow.opportunities).toBeDefined();
            expect(tableRow.opportunities).toBe(
              opportunitiesGroupedByBrandSkuPackageCodeMock[products.brandValues[index].brandCode].brandSkuPackageOpportunityCountTotal);
          });
        });

        it('should return a formatted row containing an opportunities column containing a `-` when '
        + 'there is no key matching the brandCode in the given GroupedOpportunitiesCounts', () => {
          const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
            products, opportunitiesGroupedByBrandSkuPackageCodeMock, ProductMetricsViewType.brands);

          transformedProductMetricsData.forEach((tableRow: MyPerformanceTableRow) => {
            expect(tableRow.opportunities).toBeDefined();
            expect(tableRow.opportunities).toBe('-');
          });
        });
      });

      describe('when the ProductMetricsViewType is Packages', () => {
        it('should return a formatted row containing an opportunities column with the matched brandSkuPackageOpportunityCountTotal value '
        + 'from the OpportunitiesGroupedByBrandSkuPackageCode based on the products beerId masterPackageSKUCode', () => {
          products.skuValues.forEach((product: ProductMetricsValues) => {
            opportunitiesGroupedByBrandSkuPackageCodeMock[product.beerId.masterPackageSKUCode] = {
              brandSkuPackageOpportunityCountTotal: chance.natural(),
              opportunityCounts: getOpportunityCountMocks()
            };
          });

          const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
            products, opportunitiesGroupedByBrandSkuPackageCodeMock, ProductMetricsViewType.packages);

          transformedProductMetricsData.forEach((tableRow: MyPerformanceTableRow, index: number) => {
            expect(tableRow.opportunities).toBeDefined();
            expect(tableRow.opportunities).toBe(
              opportunitiesGroupedByBrandSkuPackageCodeMock[products.skuValues[index].beerId.masterPackageSKUCode]
                .brandSkuPackageOpportunityCountTotal);
          });
        });

        it('should return a formatted row containing an opportunities column containing a `-` when '
        + 'there is no key matching the masterPackageSKUCode in the given GroupedOpportunitiesCounts', () => {
          const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
            products, opportunitiesGroupedByBrandSkuPackageCodeMock, ProductMetricsViewType.packages);

          transformedProductMetricsData.forEach((tableRow: MyPerformanceTableRow) => {
            expect(tableRow.opportunities).toBeDefined();
            expect(tableRow.opportunities).toBe('-');
          });
        });
      });

      describe('when the ProductMetricsViewType is Skus', () => {
        it('should return a formatted row containing an opportunities column with the matched total value '
        + 'from the OpportunitiesGroupedByBrandSkuPackageCode based on the products beerId masterSKUCode', () => {
          products.skuValues.forEach((product: ProductMetricsValues) => {
            opportunitiesGroupedByBrandSkuPackageCodeMock[product.beerId.masterSKUCode] = {
              brandSkuPackageOpportunityCountTotal: chance.natural(),
              opportunityCounts: getOpportunityCountMocks()
            };
          });

          const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
            products, opportunitiesGroupedByBrandSkuPackageCodeMock, ProductMetricsViewType.skus);

          transformedProductMetricsData.forEach((tableRow: MyPerformanceTableRow, index: number) => {
            expect(tableRow.opportunities).toBeDefined();
            expect(tableRow.opportunities).toBe(
              opportunitiesGroupedByBrandSkuPackageCodeMock[products.skuValues[index].beerId.masterSKUCode]
                .brandSkuPackageOpportunityCountTotal);
          });
        });

        it('should return a formatted row containing an opportunities column containing a `-` when '
        + 'there is no key matching the masterSKUCode in the given GroupedOpportunitiesCounts', () => {
          const transformedProductMetricsData: MyPerformanceTableRow[] = myPerformanceTableDataTransformerService.getRightTableData(
            products, opportunitiesGroupedByBrandSkuPackageCodeMock, ProductMetricsViewType.skus);

          transformedProductMetricsData.forEach((tableRow: MyPerformanceTableRow) => {
            expect(tableRow.opportunities).toBeDefined();
            expect(tableRow.opportunities).toBe('-');
          });
        });
      });
    });
  });

  describe('getProductMetricsSelectedBrandRow', () => {
    let productMetricsValuesMock: ProductMetricsValues;

    beforeEach(() => {
        productMetricsValuesMock = getProductMetricsBrandMock();
    });

    describe('when ProductMetricsValues are passed in with no OpportunitiesGroupedByBrandSkuPackageCode', () => {
      it('should return a formatted brandSkuPackageOpportunityCountTotal row from brand product metrics values', () => {
        const rowData: MyPerformanceTableRow =
          myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(productMetricsValuesMock, undefined);

        expect(rowData.descriptionRow0).toEqual(productMetricsValuesMock.brandDescription);
        expect(rowData.metricColumn0).toEqual(productMetricsValuesMock.current);
        expect(rowData.metricColumn1).toEqual(productMetricsValuesMock.yearAgo);
        expect(rowData.metricColumn2).toEqual(productMetricsValuesMock.yearAgoPercent);
        expect(rowData.ctv).toEqual(100);
      });
    });

    describe('when ProductMetricsValues are passed in with OpportunitiesGroupedByBrandSkuPackageCode', () => {
      let  opportunitiesGroupedByBrandSkuPackageCodeMock: OpportunitiesGroupedByBrandSkuPackageCode;

      beforeEach(() => {
        opportunitiesGroupedByBrandSkuPackageCodeMock = getOpportunitiesGroupedByBrandSkuPackageCodeMock();
      });

      it('should return a formatted row containing an opportunities column with the matched brandSkuPackageOpportunityCountTotal value '
      + 'from the OpportunitiesGroupedByBrandSkuPackageCode based on brandCode', () => {
        opportunitiesGroupedByBrandSkuPackageCodeMock[productMetricsValuesMock.brandCode] = {
          brandSkuPackageOpportunityCountTotal: chance.natural(),
          opportunityCounts: getOpportunityCountMocks()
        };

        const rowData: MyPerformanceTableRow = myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(
          productMetricsValuesMock,
          opportunitiesGroupedByBrandSkuPackageCodeMock);

        expect(rowData.opportunities).toBeDefined();
        expect(rowData.opportunities).toBe(
          opportunitiesGroupedByBrandSkuPackageCodeMock[productMetricsValuesMock.brandCode].brandSkuPackageOpportunityCountTotal);
      });

      it('should return a formatted row containing an opportunities column with a `-` value when there is no '
      + 'key matching the brandCode in the given GroupedOpportunitiesCounts', () => {
        const rowData: MyPerformanceTableRow = myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(
          productMetricsValuesMock,
          opportunitiesGroupedByBrandSkuPackageCodeMock);

        expect(rowData.opportunities).toBeDefined();
        expect(rowData.opportunities).toBe('-');
      });
    });
  });
});
