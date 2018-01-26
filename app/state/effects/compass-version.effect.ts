import { Injectable, Inject } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import * as CompassVersionActions from '../../state/actions/compass-version.action';
import { AppVersion } from '../../models/app-version.model';

@Injectable()
export class CompassVersionEffects {

  constructor(
    private actions$: Actions,
    @Inject('versionService') private versionService: any
  ) { }

  @Effect()
  fetchVersion$(): Observable<Action> {
    return this.actions$
      .ofType(CompassVersionActions.FETCH_VERSION_ACTION)
      .switchMap(() => {
        return this.versionService.getVersion()
          .then((response: AppVersion) => {
            this.versionService.model.version = response; // set on model so ng1 can still use data
            return new CompassVersionActions.FetchVersionSuccessAction(response);
          })
          .catch((err: any) => (new CompassVersionActions.FetchVersionFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchVersionFailure$(): Observable<Action> {
    return this.actions$
      .ofType(CompassVersionActions.FETCH_VERSION_FAILURE_ACTION)
      .do((action: CompassVersionActions.FetchVersionFailureAction) => {
        console.error('Version fetch failure:', action.payload);
      });
  }
}
