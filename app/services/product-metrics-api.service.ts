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
      .catch(err => this.handleError(err, aggregation, params.type));
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
      .catch(err => this.handleError(err, aggregation, params.type));
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
      .catch(err => this.handleError(err, aggregation, params.type));
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

  private handleError(err: any, aggregation: ProductMetricsAggregationType, type: string): Observable<ProductMetricsDTO> {
    if (err.status === 404) {
      let empty: ProductMetricsDTO = { type: type };
      if (aggregation === ProductMetricsAggregationType.brand) empty.brandValues = [];
      if (aggregation === ProductMetricsAggregationType.sku) empty.skuValues = [];
      return Observable.of(empty);
    }
    return Observable.throw(new Error(err));
  }
}
