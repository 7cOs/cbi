import { Injectable } from '@angular/core';

import { AccountDashboardStateParameters } from '../models/account-dashboard-state-parameters.model';
import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { EntityType } from '../enums/entity-responsibilities.enum';
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

  public getMetricValueName(metricKey: MetricTypeValue): string {

    let metricName: string;

    switch (metricKey) {
      case MetricTypeValue.PointsOfDistribution:
        metricName = 'Distribution';
        break;
      case MetricTypeValue.velocity:
        metricName = 'Velocity';
        break;
      case MetricTypeValue.volume:
      default:
        metricName = 'Depletions';
    }

    return metricName;
  }

  public accountDashboardStateParameters(insideAlternateHierarchy: boolean,
                                         filter: MyPerformanceFilterState,
                                        row: MyPerformanceTableRow,
                                        premiseType?: PremiseTypeValue): AccountDashboardStateParameters {

    let accountDashboardStateParams: AccountDashboardStateParameters = {myaccountsonly: !insideAlternateHierarchy};
    if (row.metadata.entityType === EntityType.Distributor) {
      accountDashboardStateParams.distributorname = row.descriptionRow0;
      accountDashboardStateParams.distributorid = row.metadata.positionId;
      accountDashboardStateParams.premisetype = PremiseTypeValue[filter.premiseType];
    } else if (row.metadata.entityType === EntityType.SubAccount) {
      accountDashboardStateParams.subaccountid = row.metadata.positionId;
      accountDashboardStateParams.subaccountname = row.descriptionRow0;
      accountDashboardStateParams.premisetype = PremiseTypeValue[premiseType];
    }

    switch (filter.metricType) {
      case MetricTypeValue.volume:
          accountDashboardStateParams.depletiontimeperiod = DateRangeTimePeriodValue[filter.dateRangeCode];
          break;
      case MetricTypeValue.PointsOfDistribution:
      case MetricTypeValue.velocity:
          accountDashboardStateParams.distributiontimeperiod = DateRangeTimePeriodValue[filter.dateRangeCode];
          break;
      default:
        return {};
    }
    return accountDashboardStateParams;
  }
}
