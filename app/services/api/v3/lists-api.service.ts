import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { EntitySubAccountDTO } from '../../../models/entity-subaccount-dto.model';
import { V3ApiHelperService } from './v3-api-helper.service';
import { ListStoreDTO } from '../../../models/lists-store-dto.model';

@Injectable()
export class ListsApiService {

  constructor(
    private v3ApiHelperService: V3ApiHelperService,
    private http: HttpClient
  ) { }

  public getStorePerformance(
    listsId: string,
    positionId: string
  ): Observable<ListStoreDTO[]> {
    const url = `/v3/lists/${ listsId }/stores`;
    const params = {
      positionId: positionId,
    };

    return this.http.get<ListStoreDTO[]>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public getHeaderDetail(
    listsId: string,
    positionId: string
  ): Observable<EntitySubAccountDTO[]> {
    const url = `/v3/lists/${ listsId }`;
    const params = {
      positionId: positionId,
    };

    return this.http.get<ListStoreDTO[]>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }
}
