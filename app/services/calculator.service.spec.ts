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
      spyOn(calculatorService, 'getYearAgoPercent').and.callThrough();
    });

    it('should return 0 when total and totalYearAgo are 0', () => {
      total = 0;
      totalYearAgo = 0;
      const yearAgoPercent = calculatorService.getYearAgoPercent(total, totalYearAgo);
      expect(yearAgoPercent).toEqual(0);
    });

    it('should return 100 when total is not 0 and totalYearAgo are 0', () => {
      total = 100;
      totalYearAgo = 0;
      const yearAgoPercent = calculatorService.getYearAgoPercent(total, totalYearAgo);
      expect(yearAgoPercent).toEqual(100);
    });

    it('should return the calculated YA% when total and totalYearAgo are 0', () => {
      total = 50;
      totalYearAgo = 100;
      const yearAgoPercent = calculatorService.getYearAgoPercent(total, totalYearAgo);
      const expectedYearAgoPercent = -50;
      expect(yearAgoPercent).toEqual(expectedYearAgoPercent);
    });

    it('should return 0 when the result calulated is a negative decimal that rounds down to 0', () => {
      total = 10;
      totalYearAgo = 10.0040;
      const yearAgoPercent = calculatorService.getYearAgoPercent(total, totalYearAgo);
      const expectedYearAgoPercent = -0;
      expect(yearAgoPercent).toEqual(expectedYearAgoPercent);
    });
  });
});
