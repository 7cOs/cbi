import { Http, Response } from '@angular/http';
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
export class SubAccountsApiService {

  constructor(
    private apiHelperService: ApiHelperService,
    private http: Http
  ) { }

  public getSubAccountOpportunityCounts(
    subAccountId: string,
    positionId: string,
    premiseType: string,
    countStructureType: string,
    segment: string,
    impact: string,
    type: string
  ): Observable<OpportunityCountDTO[]> {
    const url = `/v3/subAccounts/${ subAccountId }/opportunityCounts`;
    const params = {
      positionIds: positionId,
      premiseType: premiseType,
      countStructureType: countStructureType,
      segment: segment,
      impact: impact,
      type: type
    };

    return this.http.get(url, { params: params })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public getSubAccountPerformance(
    subAccountId: string,
    positionId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/subAccounts/${ subAccountId }/performanceTotal`;
    const params = Object.assign({},
      {
        positionId: positionId
      },
      this.apiHelperService.getHierarchyFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((response: Response) => response.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getSubAccountProductMetrics(
    subAccountId: string,
    positionId: string,
    aggregation: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/subAccounts/${ subAccountId }/productMetrics`;
    const params = Object.assign({},
      {
        positionId: positionId,
        aggregationLevel: aggregation
      },
      this.apiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((response: Response) => response.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(
        error,
        aggregation,
        MetricTypeValue[params.metricType]
      ));
  }
}
