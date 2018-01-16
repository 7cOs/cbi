import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiHelperService } from '../../api-helper.service';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../../models/people-responsibilities-dto.model';
import { PerformanceDTO } from '../../../models/performance.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

@Injectable()
export class PositionsApiService {

  constructor(
    private apiHelperService: ApiHelperService,
    private http: Http
  ) { }

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
}
