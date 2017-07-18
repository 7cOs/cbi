import { Action } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operator/map';
import { Observable } from 'rxjs/Observable';

export class MockStore<T> extends BehaviorSubject<T> {

  constructor(private _initialState: T) { // tslint:disable-line:no-unused-variable
    super(_initialState);
  }

  dispatch = (action: Action): void => { };

  select = <S, R>(pathOrMapFn: any, ...paths: Array<string>): Observable<R> => { // tslint:disable-line:no-unused-variable
    return map.call(this, pathOrMapFn);
  }
}
