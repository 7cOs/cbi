import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricsDTO } from '../models/product-metrics.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';

@Injectable()
export class ProductMetricsApiService {

  constructor(private http: Http) { }

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
    aggregation: ProductMetricsAggregationType,
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entityType }/productMetrics`;

    const params = Object.assign({},
      this.getFilterStateParams(filter),
      { aggregationLevel: aggregation }
    );

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getAlternateHierarchyProductMetrics(
    positionId: string,
    entityType: string,
    filter: MyPerformanceFilterState,
    aggregation: ProductMetricsAggregationType,
    contextPositionId: string
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy/${ entityType }/productMetrics`;

    const params = Object.assign({},
      this.getFilterStateParams(filter),
      {
        aggregationLevel: aggregation,
        contextPositionId: contextPositionId
      }
    );

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getAlternateHierarchyProductMetricsForPosition(
    positionId: string,
    filter: MyPerformanceFilterState,
    aggregation: ProductMetricsAggregationType,
    contextPositionId: string
  ): Observable<ProductMetricsDTO> {

    const url = `/v3/positions/${positionId}/alternateHierarchyProductMetrics`;

    const params = Object.assign({},
      this.getFilterStateParams(filter),
      {
        aggregationLevel: aggregation,
        contextPositionId: contextPositionId
      }
    );

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  private getFilterStateParams(filter: MyPerformanceFilterState): any {
    return {
      type: filter.hasOwnProperty('distributionType')
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
