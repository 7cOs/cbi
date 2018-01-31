import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { EntitySubAccountDTO } from '../../../models/entity-subaccount-dto.model';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../../models/performance.model';
import { PremiseTypeValue } from '../../../enums/premise-type.enum';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { V3ApiHelperService } from './v3-api-helper.service';

@Injectable()
export class AccountsApiService {

  constructor(
    private v3ApiHelperService: V3ApiHelperService,
    private http: HttpClient
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
        positionId: positionId
      },
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponse));
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
      this.v3ApiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handleProductMetricsNotFoundError(
        httpErrorResponse,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }

  public getSubAccounts(
    accountId: string,
    positionId: string,
    premiseType: PremiseTypeValue
  ): Observable<EntitySubAccountDTO[]> {
    const url = `/v3/accounts/${ accountId }/subAccounts`;
    const params = {
      positionId: positionId,
      premiseType: premiseType
    };

    return this.http.get<EntitySubAccountDTO[]>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }
}
