import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiHelperService } from '../../api-helper.service';
import { EntityDTO } from '../../../models/entity-dto.model';
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

  public getAccounts(positionId: string): Observable<EntityDTO[]> {
    const url = `/v3/positions/${ positionId }/accounts`;

    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public getAlternateHierarchy(positionId: string, contextPositionId: string): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy`;
    const params = {
      contextPositionId: contextPositionId
    };

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public getAlternateHierarchyGroupPerformance(
    positionId: string,
    alternateHierarchyId: string,
    groupType: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy/${ groupType }/performanceTotal`;
    const params = Object.assign({},
      this.apiHelperService.getFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getAlternateHierarchyPersonPerformance(
    positionId: string,
    alternateHierarchyId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchyPerformanceTotal`;
    const params = Object.assign({},
      {
        contextPositionId: alternateHierarchyId
      },
      this.apiHelperService.getFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handlePerformanceNotFoundError(error));
  }

  public getAlternateHierarchyPersonProductMetrics(
    positionId: string,
    contextPositionId: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${positionId}/alternateHierarchyProductMetrics`;
    const params = Object.assign({},
      {
        contextPositionId: contextPositionId,
        aggregationLevel: aggregationLevel
      },
      this.apiHelperService.getFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(error, aggregationLevel, params.metricType));
  }

  public getAlternateHierarchyRoleGroupProductMetrics(
    positionId: string,
    entityType: string,
    contextPositionId: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy/${ entityType }/productMetrics`;
    const params = Object.assign({},
      {
        aggregationLevel: aggregationLevel,
        contextPositionId: contextPositionId
      },
      this.apiHelperService.getFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(error, aggregationLevel, params.metricType));
  }

  public getDistributors(positionId: string): Observable<EntityDTO[]> {
    const url = `/v3/positions/${ positionId }/distributors`;

    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public getHierarchyGroupPerformance(
    positionId: string,
    groupType: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ groupType }/performanceTotal`;
    const params = Object.assign({},
      this.apiHelperService.getFilterStateParams(filter),
      this.apiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
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
      this.apiHelperService.getFilterStateParams(filter),
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
      this.apiHelperService.getFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(error, aggregationLevel, params.metricType));
  }

  public getRoleGroupProductMetrics(
    positionId: string,
    entityType: string,
    aggregationLevel: ProductMetricsAggregationType,
    filter: MyPerformanceFilterState
  ): Observable<ProductMetricsDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entityType }/productMetrics`;
    const params = Object.assign({},
      {
        aggregationLevel: aggregationLevel
      },
      this.apiHelperService.getFilterStateParams(filter));

    return this.http.get(url, { params: params })
      .map((res: Response) => res.json())
      .catch((error: Response) => this.apiHelperService.handleProductMetricsNotFoundError(error, aggregationLevel, params.metricType));
  }
}
