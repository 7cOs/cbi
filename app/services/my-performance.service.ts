import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { PremiseTypeValue } from '../enums/premise-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';

@Injectable()
export class MyPerformanceService {

  public getUserDefaultFilterState(filter: MyPerformanceFilterState, userType: string): MyPerformanceFilterState {

    let newFilter: MyPerformanceFilterState = {
      metricType: filter.metricType,
      dateRangeCode: filter.dateRangeCode,
      premiseType: filter.premiseType,
      distributionType: filter.distributionType
    };

    if (newFilter.metricType === MetricTypeValue.volume) {
      switch (userType) {
        case '':
        case 'SALES_HIER':
          newFilter.premiseType = PremiseTypeValue.All;
          break;
        case 'OFF_HIER':
        case 'OFF_SPEC':
          newFilter.premiseType = PremiseTypeValue.Off;
          break;
        case 'ON_HIER':
          newFilter.premiseType = PremiseTypeValue.On;
          break;
        default:
          throw new Error(`User Type ${userType} does not exist!`);
      }
    } else {
      switch (userType) {
        case '':
        case 'SALES_HIER':
        case 'OFF_HIER':
        case 'OFF_SPEC':
          newFilter.premiseType = PremiseTypeValue.Off;
          break;
        case 'ON_HIER':
          newFilter.premiseType = PremiseTypeValue.On;
          break;
        default:
          throw new Error(`User Type ${userType} does not exist!`);
      }
    }

    return newFilter;
  }
}
