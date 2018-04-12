import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ListStoreDTO } from '../../../models/lists/lists-store-dto.model';
import { ListsSummaryDTO } from '../../../models/lists/lists-header-dto.model';

@Injectable()
export class ListsApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getStoreListDetails(
    listsId: string
  ): Observable<Array<ListStoreDTO>> {
    const url = `/v3/lists/${ listsId }/stores`;
    return this.http.get<ListStoreDTO[]>(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public getListSummary(
    listsId: string
  ): Observable<ListsSummaryDTO> {
    const url = `/v3/lists/${ listsId }`;

    return this.http.get<ListStoreDTO[]>(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }
}
