import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { DateRangeApiService } from '../../services/date-range-api.service';
import * as DateRangesActions from '../../state/actions/date-ranges.action';
import { DateRangeDTO } from '../../models/date-range-dto.model';
import { DateRangeService } from '../../services/date-range.service';
import { DateRange } from '../../models/date-range.model';

@Injectable()
export class DateRangesEffects {

  constructor(
    private actions$: Actions,
    private dateRangeApiService: DateRangeApiService,
    private dateRangeService: DateRangeService
  ) { }

  @Effect()
  fetchDateRanges$(): Observable<Action> {
    return this.actions$
      .ofType(DateRangesActions.FETCH_DATE_RANGES_ACTION)
      .switchMap(() => {
        return this.dateRangeApiService.getDateRanges()
          .map((response: DateRangeDTO[]) => {
            return new DateRangesActions.FetchDateRangesSuccessAction(this.dateRangeService.transformDateRanges(response));
          })
          .catch((err: Error) => Observable.of(new DateRangesActions.FetchDateRangesFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchVersionFailure$(): Observable<Action> {
    return this.actions$
      .ofType(DateRangesActions.FETCH_DATE_RANGES_FAILURE_ACTION)
      .do(action => {
        console.error('Date ranges fetch failure:', action.payload);
      });
  }
}
