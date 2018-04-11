import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../../../models/opportunity-count-dto.model';
import { PerformanceDTO } from '../../../models/performance-dto.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { V3ApiHelperService } from './v3-api-helper.service';

@Injectable()
export class SubAccountsApiService {

  constructor(
    private v3ApiHelperService: V3ApiHelperService,
    private http: HttpClient
  ) { }

  public getSubAccountOpportunityCounts(
    subAccountId: string,
    positionId: string,
    premiseType: string, // Endpoint requires custom lower-case string instead of PremiseType enum
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

    return this.http.get<OpportunityCountDTO[]>(url, { params: params })
      .catch((error: HttpErrorResponse) => Observable.throw(error));
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
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((error: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(error));
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
      this.v3ApiHelperService.getProductMetricsFilterStateParams(filter));

    if (!positionId) delete params.positionId;

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((error: HttpErrorResponse) => this.v3ApiHelperService.handleProductMetricsNotFoundError(
        error,
        aggregation,
        MetricTypeValue[params.metricType]
      ));
  }
}
