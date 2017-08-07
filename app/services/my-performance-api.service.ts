import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { PerformanceTotal } from '../models/performance-total.model'; // tslint:disable-line:no-unused-variable
import { RoleGroupPerformanceTotal } from '../models/role-groups.model'; // tslint:disable-line:no-unused-variable

@Injectable()
export class MyPerformanceApiService {

  constructor(private http: Http) { }

  public getResponsibilities(positionId: number): Observable<any> {
    const url = `/v3/positions/${ positionId }/responsibilities`;

    return this.http.get(`${url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getResponsibilitiesPerformanceTotal(positionId: number, entityType: Array<string>): Observable<RoleGroupPerformanceTotal[]> {
    const apiCalls: any[] = [];

    entityType.forEach((entity: string) => {
      apiCalls.push(this.getResponsibilityPerformanceTotal(positionId, entity));
    });

    return Observable.forkJoin(apiCalls);
  }

  public getResponsibilityPerformanceTotal(positionId: number, entityType: string): Observable<RoleGroupPerformanceTotal|Error> {
    const url = `/v3/positions/${ positionId }/responsibilities/${ entityType }/performanceTotal`;

    return this.http.get(`${ url }`)
      .map(res => {
        return { entityType: entityType, performanceTotal: res.json() };
      })
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(positionId: number): Observable<PerformanceTotal> {
    const url = `/v3/positions/${ positionId }/performanceTotal`;

    return this.http.get(`${ url }`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  private handleError(err: Error): Observable<Error> {
    console.log(err.message || 'Unkown Error');
    return Observable.throw(err);
  }
}
