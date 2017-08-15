import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PerformanceTotal } from '../models/performance-total.model'; // tslint:disable-line:no-unused-variable
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { RoleGroupPerformanceTotal } from '../models/role-groups.model'; // tslint:disable-line:no-unused-variable

@Injectable()
export class MyPerformanceApiService {

  constructor(private http: Http) { }

  public getResponsibilities(positionId: number): Observable<any> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getResponsibilitiesPerformanceTotals(
    positionId: number, entityTypes: Array<{ entityTypeName: string, entityTypeId: string }>, filter: MyPerformanceFilterState
  ): Observable<RoleGroupPerformanceTotal[]> {
    const apiCalls: any[] = [];

    entityTypes.forEach((entity: { entityTypeName: string, entityTypeId: string }) => {
      apiCalls.push(this.getResponsibilityPerformanceTotal(positionId, entity, filter));
    });

    return Observable.forkJoin(apiCalls);
  }

  public getResponsibilityPerformanceTotal(
    positionId: number, entityType: { entityTypeName: string, entityTypeId: string }, filter: MyPerformanceFilterState
  ): Observable<RoleGroupPerformanceTotal|Error> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entityType.entityTypeId }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(filter)
    })
      .map(res => ({ entityType: entityType.entityTypeName, performanceTotal: res.json() }))
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(positionId: number, filter: MyPerformanceFilterState): Observable<PerformanceTotal> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(filter)
    })
    .map(res => res.json())
    .catch(err => this.handleError(new Error(err)));
  }

  private getFilterStateParams(filter: MyPerformanceFilterState): any {
    return {
      metricType: filter.hasOwnProperty('distributionType')
        ? DistributionTypeValue[filter.distributionType] + MetricTypeValue[filter.metricType]
        : MetricTypeValue[filter.metricType],
      dateRangeCode: DateRangeTimePeriodValue[filter.dateRangeCode],
      premiseType: PremiseTypeValue[filter.premiseType]
    };
  }

  private handleError(err: Error): Observable<Error> {
    console.log(err.message || 'Unkown Error');
    return Observable.throw(err);
  }
}
