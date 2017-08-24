import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsTrackerService {

  constructor() { }

  getTrackerInterface(): UniversalAnalytics.ga {
    return (<any>window).ga;
  }
}
