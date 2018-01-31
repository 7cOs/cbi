import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiHelperService } from '../api-helper.service';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../../../models/opportunity-count-dto.model';
import { PerformanceDTO } from '../../../models/performance.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

@Injectable()
export class DistributorsApiService {

  constructor(
    private apiHelperService: ApiHelperService,
    private http: HttpClient
  ) { }

  public getDistributorOpportunityCounts(
    distributorId: string,
    positionId: string,
    premiseType: string,
    countStructureType: string,
    segment: string,
    impact: string,
    type: string
  ): Observable<OpportunityCountDTO[]> {
    const url = `/v3/distributors/${ distributorId }/opportunityCounts`;
    const params = {
      positionIds: positionId,
      premiseType: premiseType,
      countStructureType: countStructureType,
      segment: segment,
      impact: impact,
      type: type,
    };

    if (!positionId) delete params.positionIds;

    return this.http.get<OpportunityCountDTO[]>(url, { params: params })
      .catch((error: HttpErrorResponse) => Observable.throw(error));
  }

  public getDistributorPerformance(
    distributorId: string,
    positionId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/distributors/${ distributorId }/performanceTotal`;
    const params = Object.assign({},
      {
        positionId: positionId
      },
      this.apiHelperService.getHierarchyFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((error: HttpErrorResponse) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getDistributorProductMetrics(
    distributorId: string,
    positionId: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/distributors/${ distributorId }/productMetrics`;
    const params = Object.assign({},
      {
        positionId: positionId,
        aggregationLevel: aggregationLevel
      },
      this.apiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((error: HttpErrorResponse) => this.apiHelperService.handleProductMetricsNotFoundError(
        error,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }
}
