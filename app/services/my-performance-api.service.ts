import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// tslint:disable-next-line:no-unused-variable
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';
import { PerformanceTotal } from '../models/performance-total.model';
// tslint:disable-next-line:no-unused-variable
import { RoleGroupPerformanceTotal } from '../models/role-groups.model';

@Injectable()
export class MyPerformanceApiService {
  private url: string;

  constructor(private http: Http) { }

  public getResponsibilities(personId: number): Observable<any> {
    this.url = `/v3/people/${personId}/responsibilities`;
    return this.http.get(`${this.url}`)
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
    this.url = `/v3/people/${ positionId }/responsibilities/${ entityType }/performanceTotal`;

    return this.http.get(`${ this.url }`)
      .map(res => {
        return { entityType: entityType, performanceTotal: res.json() };
      })
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(personId: number): Observable<PerformanceTotal> {
    this.url = `/v3/people/${personId}/performanceTotal`;

    return this.http.get(`${this.url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  private handleError(err: Error): Observable<Error> {
    console.log(err.message || 'Unkown Error');
    return Observable.throw(err);
  }
}
