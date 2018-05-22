import { Injectable } from '@angular/core';
import { round } from 'lodash';

@Injectable()
export class CalculatorService {

  // generic comparison for sort functions
  public compareObjects(a: any, b: any) {
    return a < b
      ? -1
      : a > b
        ? 1
        : 0;
  }

  public getPercentageOfTotal(total: number, count: number): number {
    return Math.round((count / total) * 1000) / 10;
  }

  public getYearAgoDelta(total: number, totalYearAgo: number): number {
    return Math.round(total - totalYearAgo);
  }

  public getYearAgoPercent(total: number, totalYearAgo: number): number {
    return (total === 0 && totalYearAgo === 0)
      ? 0
      : totalYearAgo === 0
        ? 100
        : round((((total / totalYearAgo) - 1) * 100), 1);
  }
}
