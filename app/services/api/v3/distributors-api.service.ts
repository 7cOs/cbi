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
export class DistributorsApiService {

  constructor(
    private v3ApiHelperService: V3ApiHelperService,
    private http: HttpClient
  ) { }

  public getDistributorOpportunityCounts(
    distributorId: string,
    positionId: string,
    premiseType: string, // Endpoint requires custom lower-case string instead of PremiseType enum
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
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
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
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponse));
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
      this.v3ApiHelperService.getProductMetricsFilterStateParams(filter));

    if (!positionId) delete params.positionId;

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handleProductMetricsNotFoundError(
        httpErrorResponse,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }
}
