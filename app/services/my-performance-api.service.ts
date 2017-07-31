import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// tslint:disable-next-line:no-unused-variable
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';
import { PerformanceTotalDTO } from '../models/performance-total-dto.model';

@Injectable()
export class MyPerformanceApiService {
  private url: string;

  constructor(private http: Http) { }

  public getResponsibilities(personId: number): Observable<EntityResponsibilitiesDTO[]> {
    this.url = `/v3/people/${personId}/responsibilities`;
    return this.http.get(`${this.url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  public getPerformanceTotal(personId: number): Observable<PerformanceTotalDTO> {
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
