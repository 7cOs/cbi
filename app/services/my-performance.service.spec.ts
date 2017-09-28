import { inject, TestBed } from '@angular/core/testing';

import { MyPerformanceService } from './my-performance.service';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { PremiseTypeValue } from '../enums/premise-type.enum';

describe('Service: MyPerformanceService', () => {
  let myPerformanceService: MyPerformanceService;
  let userType: string = ''; // Corporate User

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

    it('should return PremiseTypeValue of Off when Corporate', () => {
      spyOn(myPerformanceService, 'getUserDefaultPremiseType').and.callThrough();

      const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.velocity, userType);

      expect(newPremiseValueState).toEqual(PremiseTypeValue.Off);
    });
  });
});
