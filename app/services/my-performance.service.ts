import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AccountDashboardStateParameters } from '../models/account-dashboard-state-parameters.model';
import { AppState } from '../state/reducers/root.reducer';
import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceEntitiesData } from '../state/reducers/my-performance.reducer';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
// import { GroupedEntities } from '../models/grouped-entities.model';

@Injectable()
export class MyPerformanceService implements OnInit, OnDestroy {

  private currentState: MyPerformanceEntitiesData;
  private myPerformanceCurrentSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.myPerformanceCurrentSubscription = this.store
    .select(state => state.myPerformance.current)
    .subscribe((current: MyPerformanceEntitiesData) => {
      this.currentState = current;
    });
  }

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
    let accountDashboardStateParams: AccountDashboardStateParameters = {myaccountsonly: true};
    debugger;
    if (row.metadata.entityType === EntityType.Distributor) {
      accountDashboardStateParams.distributorname = row.descriptionRow0;
      accountDashboardStateParams.distributorid = row.metadata.positionId;
      accountDashboardStateParams.premisetype = PremiseTypeValue[filter.premiseType];
    } else if (row.metadata.entityType === EntityType.SubAccount) {
      accountDashboardStateParams.subaccountid = row.metadata.positionId;
      accountDashboardStateParams.subaccountname = row.descriptionRow0;
      // let groupedEntities: GroupedEntities = this.currentState.responsibilities.groupedEntities;
      // accountDashboardStateParams.premisetype = PremiseTypeValue[groupedE ];
    }

    switch (filter.metricType) {
      case MetricTypeValue.volume:
          accountDashboardStateParams.depletiontimeperiod = DateRangeTimePeriod[filter.dateRangeCode];
          accountDashboardStateParams.distributiontimeperiod = DateRangeTimePeriod[DateRangeTimePeriod.L90];
          break;
      case MetricTypeValue.PointsOfDistribution:
          accountDashboardStateParams.depletiontimeperiod = DateRangeTimePeriod[DateRangeTimePeriod.FYTD];
          accountDashboardStateParams.distributiontimeperiod = DateRangeTimePeriod[filter.dateRangeCode];
          break;
      case MetricTypeValue.velocity:
          accountDashboardStateParams.depletiontimeperiod = DateRangeTimePeriod[DateRangeTimePeriod.FYTD];
          accountDashboardStateParams.distributiontimeperiod = DateRangeTimePeriod[filter.dateRangeCode];
          break;
      default:
        return {};
    }
    return accountDashboardStateParams;
  }

  ngOnDestroy() {
    this.myPerformanceCurrentSubscription.unsubscribe();
  }
}
