import { inject, TestBed } from '@angular/core/testing';

import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../models/my-performance-table-row.model.mock';
import { MyPerformanceService } from './my-performance.service';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilter } from '../models/my-performance-filter.model';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';

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

  describe('getUserDefaultFilterState', () => {
    beforeEach(inject([ MyPerformanceService ],
      (_myPerformanceService: MyPerformanceService) => {
        myPerformanceService = _myPerformanceService;
    }));

    describe('when userType is OFF_SPEC and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when OFF_SPEC', () => {
        userType = 'OFF_SPEC';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is OFF_HIER and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when OFF_HIER', () => {
        userType = 'OFF_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is ON_HIER and Metric is velocity', () => {
      it('should return PremiseTypeValue On when ON_HIER', () => {
        userType = 'ON_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.On);
      });
    });

    describe('when userType is SALES_HIER and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when SALES_HIER', () => {
        userType = 'SALES_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is empty and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when empty or Corporate', () => {
        userType = '';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is empty and Metric is velocity', () => {
      it('should return PremiseTypeValue Off when undefined or Corporate', () => {
        userType = undefined;
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is OFF_SPEC and Metric is volume', () => {
      it('should return PremiseTypeValue Off when OFF_SPEC', () => {
        userType = 'OFF_SPEC';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.volume, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is OFF_HIER and Metric is volume', () => {
      it('should return PremiseTypeValue Off when OFF_HIER', () => {
        userType = 'OFF_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.volume, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
      });
    });

    describe('when userType is ON_HIER and Metric is volume', () => {
      it('should return PremiseTypeValue On when ON_HIER', () => {
        userType = 'ON_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.volume, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.On);
      });
    });

    describe('when userType is SALES_HIER and Metric is volume', () => {
      it('should return PremiseTypeValue All when SALES_HIER', () => {
        userType = 'SALES_HIER';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.volume, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
      });
    });

    describe('when userType is empty and Metric is volume', () => {
      it('should return PremiseTypeValue All when empty or Corporate', () => {
        userType = '';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.volume, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
      });
    });

    describe('when userType is empty and Metric is volume', () => {
      it('should return PremiseTypeValue All when undefined or Corporate', () => {
        userType = undefined;
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.volume, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
      });
    });
  });

  describe('when left side data row distributor link clicked', () => {
    let rowMock: MyPerformanceTableRow;
    let filterMock: MyPerformanceFilter;
    let myAccountOnlyValue: boolean;

    beforeEach(() => {
      rowMock = getMyPerformanceTableRowMock(1)[0];
      filterMock = getMyPerformanceFilterMock();
      spyOn(myPerformanceService, 'accountDashboardStateParameters').and.callThrough();
    });

    it('should return empty object when metrictype not one of other values', () => {
      filterMock.metricType = null;
      expect(myPerformanceService.accountDashboardStateParameters(myAccountOnlyValue, filterMock, rowMock, undefined)).toEqual({});
    });

    it('should return the correct option when metric type is depletions and entityType is distributor with no alternate hierarchy', () => {
      filterMock.metricType = MetricTypeValue.volume;
      rowMock.metadata.entityType = EntityType.Distributor;
      myAccountOnlyValue = true;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters
      (myAccountOnlyValue, filterMock, rowMock, undefined);
      expect(accountDashboardParams).toEqual({myaccountsonly: true,
        depletiontimeperiod: DateRangeTimePeriod[filterMock.dateRangeCode],
        distributiontimeperiod: DateRangeTimePeriod[DateRangeTimePeriod.L90],
        distributorid: rowMock.metadata.positionId,
        distributorname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[filterMock.premiseType]
      });
    });

    it('should return the correct option when metric type is distribution and entityType is distributor with alternate hierarchy', () => {
      filterMock.metricType = MetricTypeValue.PointsOfDistribution;
      rowMock.metadata.entityType = EntityType.Distributor;
      myAccountOnlyValue = false;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters
      (myAccountOnlyValue, filterMock, rowMock, undefined);
      expect(accountDashboardParams).toEqual({myaccountsonly: false,
        depletiontimeperiod: DateRangeTimePeriod[DateRangeTimePeriod.FYTD],
        distributiontimeperiod: DateRangeTimePeriod[filterMock.dateRangeCode],
        distributorid: rowMock.metadata.positionId,
        distributorname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[filterMock.premiseType]
      });
    });

    it('should return the correct option when metric type is velocity and entityType is distributor', () => {
      filterMock.metricType = MetricTypeValue.velocity;
      rowMock.metadata.entityType = EntityType.Distributor;
      myAccountOnlyValue = true;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters
      (myAccountOnlyValue, filterMock, rowMock, undefined);
      expect(accountDashboardParams).toEqual({myaccountsonly: true,
        depletiontimeperiod: DateRangeTimePeriod[DateRangeTimePeriod.FYTD],
        distributiontimeperiod: DateRangeTimePeriod[filterMock.dateRangeCode],
        distributorid: rowMock.metadata.positionId,
        distributorname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[filterMock.premiseType]
      });
    });

    it('should return the correct option when metric type is depletions and entityType is subAccount', () => {
      filterMock.metricType = MetricTypeValue.volume;
      rowMock.metadata.entityType = EntityType.SubAccount;
      myAccountOnlyValue = true;
      const premiseType = premiseTypeValues[chance.integer({min: 0, max: premiseTypeValues.length - 1})];
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters
      (myAccountOnlyValue, filterMock, rowMock, premiseType);

      expect(accountDashboardParams).toEqual({myaccountsonly: true,
        depletiontimeperiod: DateRangeTimePeriod[filterMock.dateRangeCode],
        distributiontimeperiod: DateRangeTimePeriod[DateRangeTimePeriod.L90],
        subaccountid: rowMock.metadata.positionId,
        subaccountname: rowMock.descriptionRow0,
        premisetype: PremiseTypeValue[premiseType]
      });
    });
  });

});
