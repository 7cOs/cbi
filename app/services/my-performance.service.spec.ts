import { inject, TestBed } from '@angular/core/testing';

import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { MyPerformanceService } from './my-performance.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { PremiseTypeValue } from '../enums/premise-type.enum';

describe('Service: MyPerformanceService', () => {
  let myPerformanceService: MyPerformanceService;
  let userType: string = ''; // Corporate User
  const initialFilterStateMock: MyPerformanceFilterState = {
    metricType: MetricTypeValue.velocity,
    dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
    premiseType: PremiseTypeValue.All,
    distributionType: DistributionTypeValue.simple
  };

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

    const expectedFilterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.velocity,
      dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
      premiseType: PremiseTypeValue.Off,
      distributionType: DistributionTypeValue.simple
    };

    it('should return MyPerformanceFilterState data', () => {
      spyOn(myPerformanceService, 'getUserDefaultFilterState').and.callThrough();

      const newFilterState =  myPerformanceService.getUserDefaultFilterState(initialFilterStateMock, userType);

      expect(newFilterState).toEqual(expectedFilterStateMock);
    });
  });
});
