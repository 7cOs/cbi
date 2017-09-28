import { inject, TestBed } from '@angular/core/testing';

import { MyPerformanceService } from './my-performance.service';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { PremiseTypeValue } from '../enums/premise-type.enum';

describe('Service: MyPerformanceService', () => {
  let myPerformanceService: MyPerformanceService;
  let userType: string = ''; // Corporate User
  // const initialFilterStateMock: MyPerformanceFilterState = {
  //   metricType: MetricTypeValue.velocity,
  //   dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
  //   premiseType: PremiseTypeValue.All,
  //   distributionType: DistributionTypeValue.simple
  // };

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

    it('should return MyPerformanceFilterState data', () => {
      spyOn(myPerformanceService, 'getUserDefaultPremiseType').and.callThrough();

      const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);

      expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
    });
  });
});
