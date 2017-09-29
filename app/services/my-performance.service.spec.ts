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
      it('should return PremiseTypeValue Off when Corporate', () => {
        userType = '';
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
      it('should return PremiseTypeValue All when Corporate', () => {
        userType = '';
        const newPremiseValueState =  myPerformanceService.getUserDefaultPremiseType(MetricTypeValue.volume, userType);
        expect(newPremiseValueState).toEqual(PremiseTypeValue.All);
      });
    });
  });
});
