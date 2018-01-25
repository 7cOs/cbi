import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiHelperService } from '../api-helper.service';
import { EntityDTO } from '../../../models/entity-dto.model';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../../models/people-responsibilities-dto.model';
import { PerformanceDTO } from '../../../models/performance.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

@Injectable()
export class PositionsApiService {

  constructor(
    private apiHelperService: ApiHelperService,
    private http: Http
  ) { }

  public getAccountsOrDistributors(entityURI: string): Observable<EntityDTO[]> {
    const url = `/v3${ entityURI }`;

    return this.http.get(url)
      .map(res => res.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public getAlternateHierarchy(
    positionId: string,
    alternateHierarchyPositionId: string
  ): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy`;
    const params = {
      contextPositionId: alternateHierarchyPositionId
    };

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public getAlternateHierarchyGroupPerformance(
    positionId: string,
    alternateHierarchyPositionId: string,
    groupTypeCode: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy/${ groupTypeCode }/performanceTotal`;
    const params = Object.assign({},
      {
        contextPositionId: alternateHierarchyPositionId
      },
      this.apiHelperService.getHierarchyFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getAlternateHierarchyPersonPerformance(
    positionId: string,
    alternateHierarchyPositionId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchyPerformanceTotal`;
    const params = Object.assign({},
      {
        contextPositionId: alternateHierarchyPositionId
      },
      this.apiHelperService.getHierarchyFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getAlternateHierarchyPersonProductMetrics(
    positionId: string,
    alternateHierarchyPositionId: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${positionId}/alternateHierarchyProductMetrics`;
    const params = Object.assign({},
      {
        contextPositionId: alternateHierarchyPositionId,
        aggregationLevel: aggregationLevel
      },
      this.apiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(
        error,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }

  public getAlternateHierarchyRoleGroupProductMetrics(
    positionId: string,
    groupTypeCode: string,
    alternateHierarchyPositionId: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy/${ groupTypeCode }/productMetrics`;
    const params = Object.assign({},
      {
        contextPositionId: alternateHierarchyPositionId,
        aggregationLevel: aggregationLevel
      },
      this.apiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(
        error,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }

  public getHierarchyGroupPerformance(
    positionId: string,
    groupTypeCode: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ groupTypeCode }/performanceTotal`;
    const params = Object.assign({},
      this.apiHelperService.getHierarchyFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getPeopleResponsibilities(positionId: string): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public getPersonPerformance(
    positionId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;
    const params = Object.assign({},
      this.apiHelperService.getHierarchyFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getPersonProductMetrics(
    positionId: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/productMetrics`;
    const params = Object.assign({},
      {
        aggregationLevel: aggregationLevel
      },
      this.apiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(
        error,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }

  public getRoleGroupProductMetrics(
    positionId: string,
    groupTypeCode: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ groupTypeCode }/productMetrics`;
    const params = Object.assign({},
      {
        aggregationLevel: aggregationLevel
      },
      this.apiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(
        error,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }
}
