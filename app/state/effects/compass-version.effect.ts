import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import * as CompassVersionActions from '../../state/actions/compass-version.action';
import { Http } from '@angular/http';
import { AppVersion } from '../../models/app-version.model';

@Injectable()
export class CompassVersionEffects {

  constructor(
    private actions$: Actions,
    @Inject('versionService') private versionService: any,
    private http: Http
  ) { }

  @Effect()
  fetchVersion$(): Observable<Action> {
    return this.actions$
      .ofType(CompassVersionActions.FETCH_VERSION_ACTION)
      .switchMap(action => {
        console.log('effect running for fetch. action type received:', action.type);

        // return Observable.of(new CompassVersionActions.FetchVersionSuccessAction({
        //   env: 'test',
        //   hash: 'test',
        //   version: '1.2.3'
        // }));

        // return Observable.timer(3000).switchMap(() => Observable.of(new CompassVersionActions.FetchVersionSuccessAction({
        //   env: 'test',
        //   hash: 'test',
        //   version: '1.2.3'
        // })));

        return this.versionService.getVersion()
          .then((response: AppVersion) => (new CompassVersionActions.FetchVersionSuccessAction(response)))
          .catch((err: Error) => (new CompassVersionActions.FetchVersionFailureAction(err)));

        // return this.http.get('/version')
        //   .map(res => res.json())
        //   .map(res => new CompassVersionActions.FetchVersionSuccessAction(res))
        //   .catch(err => Observable.of(new CompassVersionActions.FetchVersionFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchVersionFailure$(): Observable<Action> {
    return this.actions$
      .ofType(CompassVersionActions.FETCH_VERSION_FAILURE_ACTION)
      .do(action => {
        console.error(action.payload);
      });
  }
}
