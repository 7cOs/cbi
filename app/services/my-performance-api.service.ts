import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { EntityDTO } from '../models/entity-dto.model'; // tslint:disable-line:no-unused-variable
import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { EntityResponsibilities,
         ResponsibilityEntityPerformanceDTO } from '../models/entity-responsibilities.model'; // tslint:disable-line:no-unused-variable
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model'; // tslint:disable-line:no-unused-variable
import { PerformanceTotalDTO } from '../models/performance-total.model'; // tslint:disable-line:no-unused-variable
import { PremiseTypeValue } from '../enums/premise-type.enum';

@Injectable()
export class MyPerformanceApiService {

  constructor(private http: Http) { }

  public getResponsibilities(positionId: string): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getResponsibilitiesPerformanceTotals(
    entities: Array<{ positionId?: string, type: string, name: string }>, filter: MyPerformanceFilterState, positionId?: string
  ): Observable<ResponsibilityEntityPerformanceDTO[]> {
    const apiCalls: Observable<ResponsibilityEntityPerformanceDTO | Error>[] = [];

    entities.forEach((entity: { positionId?: string, type: string, name: string }) => {
      apiCalls.push(this.getResponsibilityPerformanceTotal(entity, filter, entity.positionId || positionId));
    });

    return Observable.forkJoin(apiCalls);
  }

  public getResponsibilityPerformanceTotal(
    entity: { type: string, name: string }, filter: MyPerformanceFilterState, positionId: string
  ): Observable<ResponsibilityEntityPerformanceDTO|Error> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entity.type }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(filter)
    })
      .map(res => ({
        id: positionId,
        name: entity.name,
        performanceTotal: res.json()
      }))
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(
    positionId: string,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceTotalDTO> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(filter)
    })
    .map(res => res.json())
    .catch(err => this.handleError(new Error(err)));
  }

  public getAccountsDistributors(
    entityURI: string
  ): Observable<Array<EntityDTO>> {
    const url = `/v3${ entityURI }`;

    return this.http.get(`${url}`)
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
