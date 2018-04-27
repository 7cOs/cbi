import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../../models/performance-dto.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { V3ApiHelperService } from './v3-api-helper.service';

@Injectable()
export class StoresApiService {

  constructor(
    private http: HttpClient,
    private v3ApiHelperService: V3ApiHelperService,
  ) { }

  public getStorePerformance(
    storeId: string,
    positionId: string,
    brandSkuCode: string,
    skuPackageType: SkuPackageType,
    filter: MyPerformanceFilterState
  ): Observable<PerformanceDTO> {
    const url = `/v3/versionedStores/${ storeId }/performanceTotal`;
    const params: any = Object.assign({},
      {
        positionId: positionId
      },
      this.v3ApiHelperService.getHierarchyFilterStateParams(filter),
      this.v3ApiHelperService.getBrandSkuPackageCodeParam(brandSkuCode, skuPackageType));

    return this.http.get<PerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => this.v3ApiHelperService.handlePerformanceNotFoundError(httpErrorResponse));
  }
}
