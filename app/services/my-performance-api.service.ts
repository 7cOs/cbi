import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// tslint:disable-next-line:no-unused-variable
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';

@Injectable()
export class MyPerformanceApiService {
  private url: string;

  constructor(private http: Http) { }

  public getResponsibilities(personId: number): Observable<any> {
    this.url = `/v3/positions/${personId}/responsibilities`;
    return this.http.get(`${this.url}`)
      .map(res => res.json())
      .catch(err => this.handleError(new Error(err)));
  }

  private handleError(err: Error): Observable<Error> {
    console.log(err.message || 'Unkown Error');
    return Observable.throw(err);
  }
}
