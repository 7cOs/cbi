import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }

  // generic comparison for sort functions
  public compareObjects(a: any, b: any) {
    return a < b
      ? -1
      : a > b
        ? 1
        : 0;
  }
}
