import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AppState } from '../state/reducers/root.reducer';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PerformanceTotal } from '../models/performance-total.model'; // tslint:disable-line:no-unused-variable
import { RoleGroupPerformanceTotal } from '../models/role-groups.model'; // tslint:disable-line:no-unused-variable

@Injectable()
export class MyPerformanceApiService {

  private filterState: MyPerformanceFilterState;

  constructor(
    private http: Http,
    private store: Store<AppState>
  ) {
    this.store.select(state => state.myPerformanceFilter).subscribe(filterState => {
      this.filterState = filterState;
    });
  }

  public getResponsibilities(positionId: number): Observable<any> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getResponsibilitiesPerformanceTotals(positionId: number, entityType: Array<string>): Observable<RoleGroupPerformanceTotal[]> {
    const apiCalls: any[] = [];

    entityType.forEach((entity: string) => {
      apiCalls.push(this.getResponsibilityPerformanceTotal(positionId, entity));
    });

    return Observable.forkJoin(apiCalls);
  }

  public getResponsibilityPerformanceTotal(positionId: number, entityType: string): Observable<RoleGroupPerformanceTotal|Error> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entityType }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(this.filterState)
    })
      .map(res => ({ entityType: entityType, performanceTotal: res.json() }))
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(positionId: number): Observable<PerformanceTotal> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;

    return this.http.get(`${ url }`, {
      params: this.getFilterStateParams(this.filterState)
    })
    .map(res => res.json())
    .catch(err => this.handleError(new Error(err)));
  }

  private getFilterStateParams(filterState: MyPerformanceFilterState): any {
    if (filterState.distributionType) {
      return {
        metricType: filterState.distributionType + filterState.metricType,
        dateRangeCode: filterState.dateRangeCode,
        premiseType: filterState.premiseType
      };
    }

    return filterState;
  }

  private handleError(err: Error): Observable<Error> {
    console.log(err.message || 'Unkown Error');
    return Observable.throw(err);
  }
}
