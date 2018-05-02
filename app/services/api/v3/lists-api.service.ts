import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ListStoreDTO } from '../../../models/lists/lists-store-dto.model';
import { ListsSummaryDTO } from '../../../models/lists/lists-header-dto.model';
import { V3List } from '../../../models/lists/lists.model';

@Injectable()
export class ListsApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getLists(): Observable<any> {
    const url = `/v3/lists`;
    const params = {
      includeCollaboratorLists: 'true',
      includeArchivedLists: 'true'
    };
    return this.http.get(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

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

  public createList(list: V3List): Observable<any> {
    const url = `/v3/lists`;

    return this.http.post(url, list)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(HttpErrorResponse));
  }
}
