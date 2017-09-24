import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { EntitiesPerformancesDTO } from '../models/entities-performances.model'; // tslint:disable-line:no-unused-variable
import { EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
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
  ): Observable<EntitiesPerformancesDTO|Error> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entity.type }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(filter)
    })
      .map(res => ({
        id: positionId,
        name: entity.name,
        positionDescription: entity.positionDescription,
        performanceTotal: res.json()
      }))
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(positionId: string, filter: MyPerformanceFilterState): Observable<EntitiesTotalPerformancesDTO> {
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
    distributorId: string,
    filter: MyPerformanceFilterState,
    contextPositionId?: string
    ): Observable<EntitiesTotalPerformancesDTO> {
    const url = `/v3/distributors/${ distributorId }/performanceTotal`;
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
    accountId: string,
    filter: MyPerformanceFilterState,
    contextPositionId?: string
    ): Observable<EntitiesTotalPerformancesDTO> {
    const url = `/v3/accounts/${ accountId }/performanceTotal`;
    const params = contextPositionId
      ? Object.assign({}, this.getFilterStateParams(filter), { positionId: contextPositionId })
      : this.getFilterStateParams(filter);

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getSubAccounts(accountId: string, contextPositionId: string, premiseType: PremiseTypeValue): Observable<EntitySubAccountDTO[]> {
    const url = `/v3/accounts/${ accountId }/subAccounts`;

    return this.http.get(`${ url }`, {
      params: {
        positionId: contextPositionId,
        premiseType: PremiseTypeValue[premiseType]
      }
    })
    .map(res => res.json())
    .catch(err => this.handleError(new Error(err)));
  }

  public getPositionProductMetrics(
    positionId: string, filter: MyPerformanceFilterState, aggregation: ProductMetricsAggregationType
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/productMetrics`;

    const params = Object.assign({},
      this.getFilterStateParams(filter),
      { aggregationLevel: aggregation }
    );

    return this.http.get(`${ url }`, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getAccountProductMetrics(
    accountId: string,
    positionId: string,
    filter: MyPerformanceFilterState,
    aggregation: ProductMetricsAggregationType
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/accounts/${ accountId }/productMetrics`;

    const params = Object.assign({},
      this.getFilterStateParams(filter),
      {
        aggregationLevel: aggregation,
        positionId: positionId
      }
    );

    return this.http.get(`${ url }`, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getRoleGroupProductMetrics(
    positionId: string,
    entityType: string,
    filter: MyPerformanceFilterState,
    aggregation: ProductMetricsAggregationType
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entityType }/productMetrics`;

    const params = Object.assign({},
      this.getFilterStateParams(filter),
      { aggregationLevel: aggregation }
    );

    return this.http.get(`${ url }`, {
      params: params
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
