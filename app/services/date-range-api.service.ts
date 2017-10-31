import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeDTO } from '../models/date-range-dto.model';

@Injectable()
export class DateRangeApiService {
  private GET_DATE_RANGES_URL: string = '/v3/dateRangeCodes';
  constructor(private http: Http) {}

  getDateRanges(): Observable<DateRangeDTO[]> {
    return this.http.get(`${this.GET_DATE_RANGES_URL}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  private handleError(err: Error): Observable<Error> {
    return Observable.throw(err);
  }
}
