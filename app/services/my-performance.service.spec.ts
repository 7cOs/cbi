import { inject, TestBed } from '@angular/core/testing';

import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';
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

    beforeEach(() => {
      rowMock = getMyPerformanceTableRowMock(1)[0];
      filterMock = getMyPerformanceFilterMock();
      spyOn(myPerformanceService, 'accountDashboardStateParameters').and.callThrough();
    });

    it('should return empty object when metrictype not one of other values', () => {
      filterMock.metricType = null;
      expect(myPerformanceService.accountDashboardStateParameters(filterMock, rowMock)).toEqual({});
    });

    it('should return the correct option when metric type is depletions', () => {
      filterMock.metricType = MetricTypeValue.volume;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters(filterMock, rowMock);
      expect(accountDashboardParams.myaccountsonly).toEqual(true);
      expect(accountDashboardParams.depletiontimeperiod).toEqual(DateRangeTimePeriod[filterMock.dateRangeCode]);
      expect(accountDashboardParams.distributiontimeperiod).toEqual(DateRangeTimePeriod[DateRangeTimePeriod.L90]);
      expect(accountDashboardParams.distributorid).toEqual(rowMock.metadata.positionId);
      expect(accountDashboardParams.premisetype).toEqual(PremiseTypeValue[filterMock.premiseType]);
    });

    it('should return the correct option when metric type is distribution', () => {
      filterMock.metricType = MetricTypeValue.PointsOfDistribution;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters(filterMock, rowMock);
      expect(accountDashboardParams.myaccountsonly).toEqual(true);
      expect(accountDashboardParams.depletiontimeperiod).toEqual(DateRangeTimePeriod[DateRangeTimePeriod.FYTD]);
      expect(accountDashboardParams.distributiontimeperiod).toEqual(DateRangeTimePeriod[filterMock.dateRangeCode]);
      expect(accountDashboardParams.distributorid).toEqual(rowMock.metadata.positionId);
      expect(accountDashboardParams.premisetype).toEqual(PremiseTypeValue[filterMock.premiseType]);
    });

    it('should return the correct option when metric type is velocity', () => {
      filterMock.metricType = MetricTypeValue.velocity;
      const accountDashboardParams = myPerformanceService.accountDashboardStateParameters(filterMock, rowMock);
      expect(accountDashboardParams.myaccountsonly).toEqual(true);
      expect(accountDashboardParams.depletiontimeperiod).toEqual(DateRangeTimePeriod[DateRangeTimePeriod.FYTD]);
      expect(accountDashboardParams.distributiontimeperiod).toEqual(DateRangeTimePeriod[filterMock.dateRangeCode]);
      expect(accountDashboardParams.distributorid).toEqual(rowMock.metadata.positionId);
      expect(accountDashboardParams.premisetype).toEqual(PremiseTypeValue[filterMock.premiseType]);
    });
  });

});
