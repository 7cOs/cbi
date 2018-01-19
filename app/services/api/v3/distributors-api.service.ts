import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiHelperService } from '../../api-helper.service';
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
    private http: Http
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

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
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
      this.apiHelperService.getFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
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
      this.apiHelperService.getFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(error, aggregationLevel, params.metricType));
  }
}
