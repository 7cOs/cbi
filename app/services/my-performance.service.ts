import { Injectable } from '@angular/core';

import { AccountDashboardStateParameters } from '../models/account-dashboard-state-parameters.model';
import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';

@Injectable()
export class MyPerformanceService {

  public getUserDefaultPremiseType(metric: MetricTypeValue, userType: string): PremiseTypeValue {
    let  defaultPremiseType: PremiseTypeValue = PremiseTypeValue.Off;

    if (metric === MetricTypeValue.volume) {
      switch (userType) {
        case 'ON_HIER':
          defaultPremiseType = PremiseTypeValue.On;
          break;
        case 'OFF_HIER':
        case 'OFF_SPEC':
          defaultPremiseType = PremiseTypeValue.Off;
          break;
        case '':
        case 'SALES_HIER':
        case undefined:
        default:
          defaultPremiseType = PremiseTypeValue.All;
      }
    } else {
      switch (userType) {
        case 'ON_HIER':
          defaultPremiseType = PremiseTypeValue.On;
          break;
        case '':
        case 'SALES_HIER':
        case 'OFF_HIER':
        case 'OFF_SPEC':
        case undefined:
        default:
          defaultPremiseType = PremiseTypeValue.Off;
      }
    }

    return defaultPremiseType;
  }

  public accountDashboardStateParameters(filter: MyPerformanceFilterState, row: MyPerformanceTableRow): AccountDashboardStateParameters {
    switch (filter.metricType) {
      case MetricTypeValue.volume:
        return {
          myaccountsonly: true,
          depletiontimeperiod: DateRangeTimePeriod[filter.dateRangeCode],
          distributiontimeperiod: DateRangeTimePeriod[DateRangeTimePeriod.L90],
          distributorid: row.metadata.positionId,
          premisetype: PremiseTypeValue[filter.premiseType]
        };
      case MetricTypeValue.PointsOfDistribution:
        return {
          myaccountsonly: true,
          depletiontimeperiod: DateRangeTimePeriod[DateRangeTimePeriod.FYTD],
          distributiontimeperiod: DateRangeTimePeriod[filter.dateRangeCode],
          distributorid: row.metadata.positionId,
          premisetype: PremiseTypeValue[filter.premiseType]
        };
      case MetricTypeValue.velocity:
        return {
          myaccountsonly: true,
          depletiontimeperiod: DateRangeTimePeriod[DateRangeTimePeriod.FYTD],
          distributiontimeperiod: DateRangeTimePeriod[filter.dateRangeCode],
          distributorid: row.metadata.positionId,
          premisetype: PremiseTypeValue[filter.premiseType]
        };
      default:
        return {};
    }
  }
}
