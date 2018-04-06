import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { DateRangeApiService } from '../../services/api/v3/date-range-api.service';
import * as DateRangesActions from '../../state/actions/date-ranges.action';
import { DateRangeDTO } from '../../models/date-range-dto.model';
import { DateRangeTransformerService } from '../../services/transformers/date-range-transformer.service';

@Injectable()
export class DateRangesEffects {

  constructor(
    private actions$: Actions,
    private dateRangeApiService: DateRangeApiService,
    private dateRangeTransformerService: DateRangeTransformerService
  ) { }

  @Effect()
  fetchDateRanges$(): Observable<Action> {
    return this.actions$
      .ofType(DateRangesActions.FETCH_DATE_RANGES_ACTION)
      .switchMap(() => {
        return this.dateRangeApiService.getDateRanges()
          .map((response: DateRangeDTO[]) => {
            return new DateRangesActions.FetchDateRangesSuccessAction(this.dateRangeTransformerService.transformDateRanges(response));
          })
          .catch((err: Error) => Observable.of(new DateRangesActions.FetchDateRangesFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchVersionFailure$(): Observable<Action> {
    return this.actions$
      .ofType(DateRangesActions.FETCH_DATE_RANGES_FAILURE_ACTION)
      .do((action: DateRangesActions.FetchDateRangesFailureAction) => {
        console.error('Date ranges fetch failure:', action.payload);
      });
  }
}
