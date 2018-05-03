import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EntityDTO } from '../../../models/entity-dto.model';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../../models/people-responsibilities-dto.model';
import { PerformanceDTO } from '../../../models/performance-dto.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { V3ApiHelperService } from './v3-api-helper.service';

@Injectable()
export class PositionsApiService {

  constructor(
    private v3ApiHelperService: V3ApiHelperService,
    private http: HttpClient
  ) { }

  public getAlternateHierarchy(
    positionId: string,
    alternateHierarchyPositionId: string
  ): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy`;
    const params = {
      contextPositionId: alternateHierarchyPositionId
    };

    return this.http.get<PeopleResponsibilitiesDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
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
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponse));
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
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponse));
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
      this.v3ApiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handleProductMetricsNotFoundError(
        httpErrorResponse,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }

  public getAlternateHierarchyGroupProductMetrics(
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
      this.v3ApiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handleProductMetricsNotFoundError(
        httpErrorResponse,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }

  public getEntityURIResponsibilities(entityURI: string): Observable<EntityDTO[]> {
    const url = `/v3${ entityURI }`;

    return this.http.get<EntityDTO[]>(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public getGroupPerformance(
    positionId: string,
    groupTypeCode: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ groupTypeCode }/performanceTotal`;
    const params: any = Object.assign({},
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponse));
  }

  public getPeopleResponsibilities(positionId: string): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get<PeopleResponsibilitiesDTO>(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public getPersonPerformance(
    positionId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;
    const params: any = Object.assign({},
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponse));
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
      this.v3ApiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handleProductMetricsNotFoundError(
        httpErrorResponse,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }

  public getGroupProductMetrics(
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
      this.v3ApiHelperService.getProductMetricsFilterStateParams(filter));

    return this.http.get<ProductMetricsDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handleProductMetricsNotFoundError(
        httpErrorResponse,
        aggregationLevel,
        MetricTypeValue[params.metricType]
      ));
  }
}
