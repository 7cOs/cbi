import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DateRangeTimePeriodValue } from '../../../enums/date-range-time-period.enum';
import { FormattedNewList } from '../../../models/lists/formatted-new-list.model';
import { ListBeverageType } from '../../../enums/list-beverage-type.enum';
import { ListOpportunityDTO } from '../../../models/lists/lists-opportunities-dto.model';
import { ListPerformanceDTO } from '../../../models/lists/list-performance-dto.model';
import { ListPerformanceType } from '../../../enums/list-performance-type.enum';
import { ListStoreDTO } from '../../../models/lists/lists-store-dto.model';
import { ListsSummaryDTO } from '../../../models/lists/lists-header-dto.model';
import { V3List } from '../../../models/lists/v3-list.model';

@Injectable()
export class ListsApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getLists(): Observable<V3List[]> {
    const url = `/v3/lists`;
    const params = {
      includeCollaboratorLists: 'true',
      includeArchivedLists: 'true'
    };
    return this.http.get(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public getListsPromise(): Promise<V3List[]> {
    return this.getLists().toPromise();
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

  public createList(list: FormattedNewList): Observable<V3List> {
    const url = `/v3/lists`;

    return this.http.post(url, list)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public createListPromise(list: FormattedNewList): Promise<V3List> {
    return this.createList(list).toPromise();
  }

  public updateList(list: FormattedNewList, listsId: string): Observable<any> {
    const url = `v3/lists/${ listsId }`;
    return this.http.put(url, list)
    .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(HttpErrorResponse));
  }

  public updateListPromise(list: FormattedNewList, listsId: string): Promise<any> {
    return this.updateList(list, listsId).toPromise();
  }

  public deleteList(listId: string): Observable<{status: string}> {
    const url = `/v3/lists/${ listId }`;

    return this.http.delete(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(HttpErrorResponse));
  }

  public deleteListPromise(listId: string): Promise<{status: string}> {
    return this.deleteList(listId).toPromise();
  }

  public addOpportunitiesToList(listId: string, opportunities: {opportunityId: string}[]): Observable<ListOpportunityDTO[]> {
    const url = `/v3/lists/${ listId }/opportunities`;

    return this.http.post(url, opportunities)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public addStoresToList(listId: string, stores: {storeSourceCode: string}): Observable<ListStoreDTO[]> {
    const url = `/v3/lists/${ listId }/stores`;

    return this.http.post(url, stores)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public addOpportunitiesToListPromise(listId: string, opportunities: {opportunityId: string}[]): Promise<ListOpportunityDTO[]> {
    return this.addOpportunitiesToList(listId, opportunities).toPromise();
  }

  public getOppsDataForList(
    listId: string
  ): Observable<Array<ListOpportunityDTO>> {
    const url = `v3/lists/${ listId }/opportunities`;

    return this.http.get<ListOpportunityDTO[]>(url)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public getListStorePerformance(
    listId: string,
    type: ListPerformanceType,
    beverageType: ListBeverageType,
    dateRangeCode: DateRangeTimePeriodValue
  ): Observable<ListPerformanceDTO> {
    const url = `/v3/lists/${ listId }/storePerformance`;
    const params = {
      type: type,
      beverageType: beverageType,
      dateRangeCode: dateRangeCode
    };

    return this.http.get<ListPerformanceDTO>(url, { params: params })
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }

  public removeStoreFromList(listId: string, storeSource: string): Observable<{status: number}> {
    const url = `/v3/lists/${ listId }/stores/${ storeSource }`;
    return this.http.delete(url)
    .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(HttpErrorResponse));
  }

  public removeOpportunityFromList(listId: string, opportunityId: string): Observable<{status: number}> {
    const url = `/v3/lists/${ listId }/opportunities/${ opportunityId  }`;
    return this.http.delete(url)
    .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(HttpErrorResponse));
  }
}
