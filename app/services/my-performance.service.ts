import { Injectable } from '@angular/core';

import { AccountDashboardStateParameters } from '../models/account-dashboard-state-parameters.model';
import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricHeaderProductType, SalesHierarchyHeaderEntityType } from '../enums/team-performance-table-header.enum';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SalesHierarchyViewType } from '../enums/sales-hierarchy-view-type.enum';

@Injectable()
export class MyPerformanceService {

  private premiseTypeLabelMap = {
    [PremiseTypeValue.All]: 'All',
    [PremiseTypeValue.Off]: 'Off-Premise',
    [PremiseTypeValue.On]: 'On-Premise'
  };

  public getUserDefaultPremiseType(metric: MetricTypeValue, userType: string): PremiseTypeValue {
    let  defaultPremiseType: PremiseTypeValue = PremiseTypeValue.Off;

    if (metric === MetricTypeValue.Depletions) {
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
      case MetricTypeValue.Distribution:
        metricName = 'Distribution';
        break;
      case MetricTypeValue.Velocity:
        metricName = 'Velocity';
        break;
      case MetricTypeValue.Depletions:
      default:
        metricName = 'Depletions';
    }

    return metricName;
  }

  public accountDashboardStateParameters(
    insideAlternateHierarchy: boolean,
    insideExceptionHierarchy: boolean,
    dateRangeCode: DateRangeTimePeriodValue,
    metricType: MetricTypeValue,
    row: MyPerformanceTableRow,
    premiseType: PremiseTypeValue): AccountDashboardStateParameters {

    let accountDashboardStateParams: AccountDashboardStateParameters = {myaccountsonly: !insideAlternateHierarchy};
    if (row.metadata.entityType === EntityType.Distributor) {
      if (insideExceptionHierarchy) {
        accountDashboardStateParams.myaccountsonly = true;
      }
      accountDashboardStateParams.distributorname = row.descriptionRow0;
      accountDashboardStateParams.distributorid = row.metadata.positionId;
      accountDashboardStateParams.premisetype = PremiseTypeValue[premiseType];
    } else if (row.metadata.entityType === EntityType.SubAccount) {
      accountDashboardStateParams.subaccountid = row.metadata.positionId;
      accountDashboardStateParams.subaccountname = row.descriptionRow0;
      accountDashboardStateParams.premisetype = PremiseTypeValue[premiseType];
    }

    switch (metricType) {
      case MetricTypeValue.Depletions:
          accountDashboardStateParams.depletiontimeperiod = DateRangeTimePeriodValue[dateRangeCode];
          break;
      case MetricTypeValue.Distribution:
      case MetricTypeValue.Velocity:
          accountDashboardStateParams.distributiontimeperiod = DateRangeTimePeriodValue[dateRangeCode];
          break;
      default:
        return {};
    }
    return accountDashboardStateParams;
  }

  public getSalesHierarchyViewTypeLabel(viewType: SalesHierarchyViewType): SalesHierarchyHeaderEntityType {
    switch (viewType) {
      case SalesHierarchyViewType.roleGroups:
      default:
        return SalesHierarchyHeaderEntityType.Group;
      case SalesHierarchyViewType.people:
        return SalesHierarchyHeaderEntityType.Person;
      case SalesHierarchyViewType.distributors:
        return SalesHierarchyHeaderEntityType.Distributor;
      case SalesHierarchyViewType.accounts:
        return SalesHierarchyHeaderEntityType.Account;
      case SalesHierarchyViewType.subAccounts:
        return SalesHierarchyHeaderEntityType.SubAccount;
      case SalesHierarchyViewType.stores:
        return SalesHierarchyHeaderEntityType.Store;
    }
  }

  public getProductMetricsViewTypeLabel(viewType: ProductMetricsViewType): ProductMetricHeaderProductType {
    switch (viewType) {
      case ProductMetricsViewType.brands:
      default:
        return ProductMetricHeaderProductType.Brand;
      case ProductMetricsViewType.skus:
        return ProductMetricHeaderProductType.SKU;
      case ProductMetricsViewType.packages:
        return ProductMetricHeaderProductType.Package;
    }
  }

  public getPremiseTypeStateLabel(premiseType: PremiseTypeValue): string {
    return this.premiseTypeLabelMap[premiseType] || 'All';
  }
}
