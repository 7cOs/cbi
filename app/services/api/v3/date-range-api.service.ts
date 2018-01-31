import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeDTO } from '../../../models/date-range-dto.model';

@Injectable()
export class DateRangeApiService {
  private GET_DATE_RANGES_URL: string = '/v3/dateRangeCodes';

  constructor(private http: HttpClient) { }

  public getDateRanges(): Observable<DateRangeDTO[]> {
    return this.http.get<DateRangeDTO[]>(this.GET_DATE_RANGES_URL)
      .catch((httpErrorResponse: HttpErrorResponse) => Observable.throw(httpErrorResponse));
  }
}
