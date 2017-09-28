import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { PremiseTypeValue } from '../enums/premise-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';

@Injectable()
export class MyPerformanceService {

  public getUserDefaultPremiseType(metric: MetricTypeValue, userType: string): PremiseTypeValue {
    let  defaultPremiseType: PremiseTypeValue = PremiseTypeValue.Off;

    if (metric === MetricTypeValue.volume) {
      switch (userType) {
        case '':
        case 'SALES_HIER':
          defaultPremiseType = PremiseTypeValue.All;
          break;
        case 'OFF_HIER':
        case 'OFF_SPEC':
          defaultPremiseType = PremiseTypeValue.Off;
          break;
        case 'ON_HIER':
          defaultPremiseType = PremiseTypeValue.On;
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
          defaultPremiseType = PremiseTypeValue.Off;
          break;
        case 'ON_HIER':
          defaultPremiseType = PremiseTypeValue.On;
          break;
        default:
          throw new Error(`User Type ${userType} does not exist!`);
      }
    }

    return defaultPremiseType;
  }
}
