import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { HierarchyGroup } from '../models/hierarchy-group.model';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../models/performance.model';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';

@Injectable()
export class MyPerformanceApiService {

  constructor(private http: Http) { }

  public getResponsibilities(positionId: string): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getHierarchyGroupPerformance(entity: HierarchyGroup, filter: MyPerformanceFilterState,
                                      positionId: string, brandSkuCode?: string, skuPackageType?: SkuPackageType)
  : Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entity.type }/performanceTotal`;

    return this.http.get(url, {
      params: this.getParams(filter, brandSkuCode, skuPackageType)
    })
      .map(res => res.json())
      .catch(err => this.handlePerformanceError(err);
  }

  public getAlternateHierarchyGroupPerformance(group: HierarchyGroup, positionId: string,
    alternateHierarchyId: string, filter: MyPerformanceFilterState, brandSkuCode?: string, skuPackageType?: SkuPackageType)
  : Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy/${ group.type }/performanceTotal`;
    const params = Object.assign({}, this.getParams(filter, brandSkuCode, skuPackageType), {
      contextPositionId: alternateHierarchyId
    });

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handlePerformanceError(err));
  }

  public getPerformance(positionId: string, filter: MyPerformanceFilterState,
                        brandCode?: string, skuPackageType?: SkuPackageType): Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getParams(filter, brandCode, skuPackageType)
    })
      .map(res => res.json())
      .catch(err => this.handlePerformanceError(err));
  }

  public getAlternateHierarchyPersonPerformance(
    positionId: string,
    alternateHierarchyId: string,
    filter: MyPerformanceFilterState,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType)
  : Observable<PerformanceDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchyPerformanceTotal`;
    const params = Object.assign({}, this.getParams(filter, brandSkuCode, skuPackageType), {
      contextPositionId: alternateHierarchyId
    });

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handlePerformanceError(err));
  }

  public getAccountsDistributors(entityURI: string): Observable<Array<EntityDTO>> {
    const url = `/v3${ entityURI }`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(err));
  }

  public getDistributorPerformance(
    distributorId: string,
    filter: MyPerformanceFilterState,
    contextPositionId?: string,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType
    ): Observable<PerformanceDTO> {
    const url = `/v3/distributors/${ distributorId }/performanceTotal`;
    const params = contextPositionId
      ? Object.assign({}, this.getParams(filter, brandSkuCode, skuPackageType), { positionId: contextPositionId })
      : this.getParams(filter, brandSkuCode, skuPackageType);

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handlePerformanceError(err));
  }

  public getAccountPerformance(
    accountId: string,
    filter: MyPerformanceFilterState,
    contextPositionId?: string,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType
    ): Observable<PerformanceDTO> {
    const url = `/v3/accounts/${ accountId }/performanceTotal`;
    const params = contextPositionId
      ? Object.assign({}, this.getParams(filter, brandSkuCode, skuPackageType), { positionId: contextPositionId })
      : this.getParams(filter, brandSkuCode, skuPackageType);

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handlePerformanceError(err));
  }

  public getSubAccounts(accountId: string, contextPositionId: string, premiseType: PremiseTypeValue): Observable<EntitySubAccountDTO[]> {
    const url = `/v3/accounts/${ accountId }/subAccounts`;

    return this.http.get(`${ url }`, {
      params: {
        positionId: contextPositionId,
        premiseType: PremiseTypeValue[premiseType]
      }
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getSubAccountPerformance(
    subAccountId: string, contextPositionId: string, filter: MyPerformanceFilterState,
    brandSkuCode?: string, skuPackageType?: SkuPackageType)
  : Observable<PerformanceDTO> {
    const url = `/v3/subAccounts/${ subAccountId }/performanceTotal`;
    const params = Object.assign({}, this.getParams(filter, brandSkuCode, skuPackageType), { positionId: contextPositionId });

    return this.http.get(url, {
      params: params
    })
      .map(res => res.json())
      .catch(err => this.handlePerformanceError(err));
  }

  public getAlternateHierarchy(positionId: string, contextPositionId: string): Observable<PeopleResponsibilitiesDTO> {
    const url = `/v3/positions/${ positionId }/alternateHierarchy`;

    return this.http.get(url, {
      params: {
        contextPositionId: contextPositionId
      }
    })
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  private getParams(filter: MyPerformanceFilterState, brandSkuCode?: string, skuPackageType?: SkuPackageType): any {
    let params: any = {
      metricType: filter.hasOwnProperty('distributionType')
        ? DistributionTypeValue[filter.distributionType] + MetricTypeValue[filter.metricType]
        : MetricTypeValue[filter.metricType],
      dateRangeCode: DateRangeTimePeriodValue[filter.dateRangeCode],
      premiseType: PremiseTypeValue[filter.premiseType],
    };
    if (skuPackageType) {
      skuPackageType === SkuPackageType.sku
        ? params.masterSKU = brandSkuCode
        : params.masterPackageSKU = brandSkuCode;
    } else {
      params.brandCode = brandSkuCode;
    }

    return params;
  }

  private handleError(err: Error): Observable<Error> {
    return Observable.throw(err);
  }

  private handlePerformanceError(err: any): Observable<PerformanceDTO> {
    if (err.status === 404) {
      const emptyDTO: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };
      return Observable.of(emptyDTO);
    }
    return Observable.throw(new Error(err));
  }
}
