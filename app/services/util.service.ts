import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  // generic comparison for sort functions
  public compareObjects(a: any, b: any) {
    return a < b
      ? -1
      : a > b
        ? 1
        : 0;
  }

  public getYearAgoPercent(total: number, totalYearAgo: number): number {
    return parseFloat((total / totalYearAgo).toFixed(1));
  }
}
