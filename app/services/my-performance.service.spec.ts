import { inject, TestBed } from '@angular/core/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../models/my-performance-table-row.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilter } from '../models/my-performance-filter.model';
import { MyPerformanceService } from './my-performance.service';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricHeaderProductType, SalesHierarchyHeaderEntityType } from '../enums/team-performance-table-header.enum';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SalesHierarchyViewType } from '../enums/sales-hierarchy-view-type.enum';

describe('Service: MyPerformanceService', () => {
  let myPerformanceService: MyPerformanceService;
  let userType: string;
  const premiseTypeValues = Object.keys(PremiseTypeValue).map(key => PremiseTypeValue[key]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyPerformanceService
      ]
    });
  });

  beforeEach(inject([ MyPerformanceService ],
    (_myPerformanceService: MyPerformanceService) => {
      myPerformanceService = _myPerformanceService;
  }));

  describe('getUserDefaultFilterState', () => {

    describe('when userType is OFF_SPEC and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when OFF_SPEC', () => {
        userType = 'OFF_SPEC';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is OFF_HIER and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when OFF_HIER', () => {
        userType = 'OFF_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is ON_HIER and Metric is velocity', () => {
      it('should return PremiseTypeValue On when ON_HIER', () => {
        userType = 'ON_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.On);
      });
    });

    describe('when userType is SALES_HIER and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when SALES_HIER', () => {
        userType = 'SALES_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is empty and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when empty or Corporate', () => {
        userType = '';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is empty and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when undefined or Corporate', () => {
        userType = undefined;
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is OFF_SPEC and Metric is volume', () => {
      it('should return PremiseTypeValue Off when OFF_SPEC', () => {
        userType = 'OFF_SPEC';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Depletions, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is OFF_HIER and Metric is volume', () => {
      it('should return PremiseTypeValue Off when OFF_HIER', () => {
        userType = 'OFF_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Depletions, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is ON_HIER and Metric is volume', () => {
      it('should return PremiseTypeValue On when ON_HIER', () => {
        userType = 'ON_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Depletions, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.On);
      });
    });

    describe('when userType is SALES_HIER and Metric is volume', () => {
      it('should return PremiseTypeValue All when SALES_HIER', () => {
        userType = 'SALES_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Depletions, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
      });
    });

    describe('when userType is empty and Metric is volume', () => {
      it('should return PremiseTypeValue All when empty or Corporate', () => {
        userType = '';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Depletions, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
      });
    });

    describe('when userType is empty and Metric is volume', () => {
      it('should return PremiseTypeValue All when undefined or Corporate', () => {
        userType = undefined;
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.Depletions, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
      });
    });
  });

  describe('getMetricValueName', () => {

    describe('metricKey is Velocity', () => {
      it('should return Velocity', () => {
        const newPremiseValueState =  myPerformanceService.getMetricValueName(MetricTypeValue.Velocity);
        expect(newPremiseValueState).toEqual('Velocity');
      });

      it('should return Distribution', () => {
        const newPremiseValueState =  myPerformanceService.getMetricValueName(MetricTypeValue.Distribution);
        expect(newPremiseValueState).toEqual('Distribution');
      });

      it('should return Volume', () => {
        const newPremiseValueState =  myPerformanceService.getMetricValueName(MetricTypeValue.Depletions);
        expect(newPremiseValueState).toEqual('Depletions');
      });
    });
  });

  describe('when left side data row distributor link clicked', () => {
    let rowMock: MyPerformanceTableRow;
    let filterMock: MyPerformanceFilter;
    let insideAlternateHierarchyMock: boolean;
    let insideExceptionHierarchyMock: boolean;

    beforeEach(() => {
      rowMock = getMyPerformanceTableRowMock(1)[0];
      filterMock = getMyPerformanceFilterMock();
      insideAlternateHierarchyMock = chance.bool();
      insideExceptionHierarchyMock = false;
      spyOn(myPerformanceService, 'accountDashboardStateParameters').and.callThrough();
    });

    it('should return empty object when metrictype not one of other values', () => {
      filterMock.metricType = null;
      expect(myPerformanceService.accountDashboardStateParameters(
        insideAlternateHierarchyMock,
        insideExceptionHierarchyMock,
        filterMock.dateRangeCode,
        filterMock.metricType,
        rowMock,
        filterMock.premiseType)).toEqual({});
    });

    it('should return the correct option when metric type is depletions and entityType is distributor', () => {
      filterMock.metricType = MetricTypeValue.Depletions;
      rowMock.metadata.entityType = EntityType.Distributor;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters(
        insideAlternateHierarchyMock,
        insideExceptionHierarchyMock,
        filterMock.dateRangeCode,
        filterMock.metricType,
        rowMock,
        filterMock.premiseType);
      expect(accountDashboardParams).toEqual({myaccountsonly: !insideAlternateHierarchyMock,
        depletiontimeperiod: DateRangeTimePeriodValue[filterMock.dateRangeCode],
        distributorid: rowMock.metadata.positionId,
        distributorname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[filterMock.premiseType]
      });
    });

    it('should return the correct option when metric type is distribution and entityType ' +
      'is distributor with no alternate hierarchy', () => {
      filterMock.metricType = MetricTypeValue.Distribution;
      rowMock.metadata.entityType = EntityType.Distributor;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters(
        insideAlternateHierarchyMock,
        insideExceptionHierarchyMock,
        filterMock.dateRangeCode,
        filterMock.metricType,
        rowMock,
        filterMock.premiseType);
      expect(accountDashboardParams).toEqual({myaccountsonly: !insideAlternateHierarchyMock,
        distributiontimeperiod: DateRangeTimePeriodValue[filterMock.dateRangeCode],
        distributorid: rowMock.metadata.positionId,
        distributorname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[filterMock.premiseType]
      });
    });

    it('should return the correct option when metric type is velocity and entityType is distributor with alternate hierarchy', () => {
      filterMock.metricType = MetricTypeValue.Velocity;
      rowMock.metadata.entityType = EntityType.Distributor;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters(
        insideAlternateHierarchyMock,
        insideExceptionHierarchyMock,
        filterMock.dateRangeCode,
        filterMock.metricType,
        rowMock,
        filterMock.premiseType);
      expect(accountDashboardParams).toEqual({myaccountsonly: !insideAlternateHierarchyMock,
        distributiontimeperiod: DateRangeTimePeriodValue[filterMock.dateRangeCode],
        distributorid: rowMock.metadata.positionId,
        distributorname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[filterMock.premiseType]
      });
    });

    it('should return the correct option when metric type is depletions and entityType is subAccount', () => {
      filterMock.metricType = MetricTypeValue.Depletions;
      rowMock.metadata.entityType = EntityType.SubAccount;
      const premiseType = premiseTypeValues[chance.integer({min: 0, max: premiseTypeValues.length - 1})];
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters(
        insideAlternateHierarchyMock,
        insideExceptionHierarchyMock,
        filterMock.dateRangeCode,
        filterMock.metricType,
        rowMock,
        premiseType);

      expect(accountDashboardParams).toEqual({myaccountsonly: !insideAlternateHierarchyMock,
        depletiontimeperiod: DateRangeTimePeriodValue[filterMock.dateRangeCode],
        subaccountid: rowMock.metadata.positionId,
        subaccountname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[premiseType]
      });
    });
  });

  describe('getSalesHierarchyViewTypeLabel', () => {

    it('should return the SalesHierarchyHeaderEntityType associated with the passed in SalesHierarchyViewType', () => {
      const actualRoleGroupLabel = myPerformanceService.getSalesHierarchyViewTypeLabel(SalesHierarchyViewType.roleGroups);
      const actualPeopleLabel = myPerformanceService.getSalesHierarchyViewTypeLabel(SalesHierarchyViewType.people);
      const actualDistributorsLabel = myPerformanceService.getSalesHierarchyViewTypeLabel(SalesHierarchyViewType.distributors);
      const actualAccountsLabel = myPerformanceService.getSalesHierarchyViewTypeLabel(SalesHierarchyViewType.accounts);
      const actualSubAccountsLabel = myPerformanceService.getSalesHierarchyViewTypeLabel(SalesHierarchyViewType.subAccounts);
      const actualStoresLabel = myPerformanceService.getSalesHierarchyViewTypeLabel(SalesHierarchyViewType.stores);

      expect(actualRoleGroupLabel).toBe(SalesHierarchyHeaderEntityType.Group);
      expect(actualPeopleLabel).toBe(SalesHierarchyHeaderEntityType.Person);
      expect(actualDistributorsLabel).toBe(SalesHierarchyHeaderEntityType.Distributor);
      expect(actualAccountsLabel).toBe(SalesHierarchyHeaderEntityType.Account);
      expect(actualSubAccountsLabel).toBe(SalesHierarchyHeaderEntityType.SubAccount);
      expect(actualStoresLabel).toBe(SalesHierarchyHeaderEntityType.Store);
    });
  });

  describe('getProductMetricsViewTypeLabel', () => {

    it('should return the ProductMetricHeaderProductType associated with the passed in ProductMetricsViewType', () => {
      const actualBrandsLabel = myPerformanceService.getProductMetricsViewTypeLabel(ProductMetricsViewType.brands);
      const actualSkusLabel = myPerformanceService.getProductMetricsViewTypeLabel(ProductMetricsViewType.skus);
      const actualPackagesLabel = myPerformanceService.getProductMetricsViewTypeLabel(ProductMetricsViewType.packages);

      expect(actualBrandsLabel).toBe(ProductMetricHeaderProductType.Brand);
      expect(actualSkusLabel).toBe(ProductMetricHeaderProductType.SKU);
      expect(actualPackagesLabel).toBe(ProductMetricHeaderProductType.Package);
    });
  });

  describe('getPremiseTypeStateLabel', () => {

    it('should return a label associated with the passed in PremiseTypeValue', () => {
      const actualAllPremiseTypeLabel = myPerformanceService.getPremiseTypeStateLabel(PremiseTypeValue.All);
      const actualOffPremiseTypeLabel = myPerformanceService.getPremiseTypeStateLabel(PremiseTypeValue.Off);
      const actualOnPremiseTypeLabel = myPerformanceService.getPremiseTypeStateLabel(PremiseTypeValue.On);

      expect(actualAllPremiseTypeLabel).toBe('All');
      expect(actualOffPremiseTypeLabel).toBe('Off-Premise');
      expect(actualOnPremiseTypeLabel).toBe('On-Premise');
    });
  });
});
