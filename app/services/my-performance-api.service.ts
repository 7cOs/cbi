import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { EntityWithPerformanceDTO } from '../models/entity-with-performance.model'; // tslint:disable-line:no-unused-variable
import { PerformanceDTO } from '../models/performance.model';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricType } from '../enums/product-metrics-type.enum';
import { ProductMetricsDTO } from '../models/entity-product-metrics-dto.model'; // tslint:disable-line:no-unused-variable

@Injectable()
export class MyPerformanceApiService {

  constructor(private http: Http) { }

  public getResponsibilities(positionId: string): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getResponsibilityPerformanceTotal(
    entity: { type: string, name: string, positionDescription: string }, filter: MyPerformanceFilterState, positionId: string
  ): Observable<EntityWithPerformanceDTO|Error> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entity.type }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(filter)
    })
      .map(res => ({
        id: positionId,
        name: entity.name,
        positionDescription: entity.positionDescription,
        performance: res.json()
      }))
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(positionId: string, filter: MyPerformanceFilterState): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(filter)
    })
    .map(res => res.json())
    .catch(err => this.handleError(new Error(err)));
  }

  public getAccountsDistributors(entityURI: string): Observable<Array<EntityDTO>> {
    const url = `/v3${ entityURI }`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getDistributorPerformance(
    distributorID: string,
    filter: MyPerformanceFilterState,
    contextPositionId?: string
    ): Observable<PerformanceDTO> {
    const url = `/v3/distributors/${distributorID}/performanceTotal`;
    const params = contextPositionId
      ? Object.assign({}, this.getFilterStateParams(filter), { positionId: contextPositionId })
      : this.getFilterStateParams(filter);

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getAccountPerformance(
    accountID: string,
    filter: MyPerformanceFilterState,
    contextPositionId?: string
    ): Observable<PerformanceDTO> {
    const url = `/v3/accounts/${accountID}/performanceTotal`;
    const params = contextPositionId
      ? Object.assign({}, this.getFilterStateParams(filter), { positionId: contextPositionId })
      : this.getFilterStateParams(filter);

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getSubAccounts(positionId: string, contextPositionId: string, premiseType: PremiseTypeValue): Observable<EntitySubAccountDTO[]> {
    const url = `/v3/accounts/${ positionId }/subAccounts`;

    return this.http.get(`${ url }`, {
      params: {
        positionId: contextPositionId,
        premiseType: PremiseTypeValue[premiseType]
      }
    })
    .map(res => res.json())
    .catch(err => this.handleError(new Error(err)));
  }

  public getProductMetrics(
    positionId: string, filter: MyPerformanceFilterState, aggregation: ProductMetricType
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/productMetrics`;

    const filterStateParams = this.getFilterStateParams(filter);

    Object.assign(filterStateParams, {
      aggregationLevel: aggregation
    });

    return this.http.get(`${ url }`, {
      params: Object.assign({}, this.getFilterStateParams(filter), {
        aggregationLevel: aggregation
      })
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
    console.log(err.message || 'Unknown Error');
    return Observable.throw(err);
  }
}
