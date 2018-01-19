import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiHelperService } from '../../api-helper.service';
import { EntitySubAccountDTO } from '../../../models/entity-subaccount-dto.model';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../../models/performance.model';
import { PremiseTypeValue } from '../../../enums/premise-type.enum';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

@Injectable()
export class DistributorsApiService {

  constructor(
    private apiHelperService: ApiHelperService,
    private http: Http
  ) { }

  public getAccountPerformance(
    accountId: string,
    positionId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/accounts/${ accountId }/performanceTotal`;
    const params = Object.assign({},
      {
        positionId: positionId // TODO: Check if this needs to be explicitly added
      },
      this.apiHelperService.getFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getAccountProductMetrics(
    accountId: string,
    positionId: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/accounts/${ accountId }/productMetrics`;
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

  public getSubAccounts(accountId: string, positionId: string, premiseType: PremiseTypeValue): Observable<EntitySubAccountDTO[]> {
    const url = `/v3/accounts/${ accountId }/subAccounts`;
    const params = {
      positionId: positionId,
      premiseType: premiseType
    };

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
  }
}
