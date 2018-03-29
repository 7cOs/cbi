import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { StoreListDTO } from '../../../models/lists-store-dto.model';
import { ListHeaderInfoDTO } from '../../../models/lists-store-header-dto.model';

@Injectable()
export class ListsApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getStorePerformance(
    listsId: string
  ): Observable<Array<StoreListDTO>> {
    const url = `/v3/lists/${ listsId }/stores`;
    return this.http.get<StoreListDTO[]>(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public getHeaderDetail(
    listsId: string
  ): Observable<ListHeaderInfoDTO> {
    const url = `/v3/lists/${ listsId }`;

    return this.http.get<StoreListDTO[]>(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }
}
