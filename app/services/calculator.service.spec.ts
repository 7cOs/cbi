import { inject, TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';

describe('Service: CalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CalculatorService
    ]
  }));

  describe('getYearAgoPercent', () => {
    let calculatorService: CalculatorService;
    let total: number;
    let totalYearAgo: number;

    beforeEach(inject([ CalculatorService ],
      (_calculatorService: CalculatorService) => {
        calculatorService = _calculatorService;
    }));

    beforeEach(() => {
      total = chance.natural({min: 1, max: 1000000});
      totalYearAgo = chance.natural({min: 1, max: 1000000});
      spyOn(calculatorService, 'getYearAgoPercent').and.callThrough();
    });

    it('should return 0 when total and totalYearAgo are 0', () => {
      total = 0;
      totalYearAgo = 0;
      const yearAgoPercent = calculatorService.getYearAgoPercent(total, totalYearAgo);
      expect(yearAgoPercent).toEqual(0);
    });

    it('should return 100 when total is not 0 and totalYearAgo are 0', () => {
      totalYearAgo = 0;
      const yearAgoPercent = calculatorService.getYearAgoPercent(total, totalYearAgo);
      expect(yearAgoPercent).toEqual(100);
    });

    it('should return 0 when total and totalYearAgo are 0', () => {
      const yearAgoPercent = calculatorService.getYearAgoPercent(total, totalYearAgo);
      const expectedYearAgoPercent = (((total / totalYearAgo) - 1) * 100);
      expect(yearAgoPercent).toEqual(expectedYearAgoPercent);
    });
  });
});
