import { Injectable } from '@angular/core';

@Injectable()
export class CompassListClassUtilService {
  public getTrendClass(num: number): string {
    return num >= 0 ? 'positive' : 'negative';
  }
}
