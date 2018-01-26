import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeDTO } from '../../../models/date-range-dto.model';

@Injectable()
export class DateRangeApiService {
  private GET_DATE_RANGES_URL: string = '/v3/dateRangeCodes';

  constructor(private http: Http) { }

  public getDateRanges(): Observable<DateRangeDTO[]> {
    return this.http.get(this.GET_DATE_RANGES_URL)
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error));
  }
}
