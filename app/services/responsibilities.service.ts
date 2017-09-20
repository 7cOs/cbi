import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { EntityResponsibilities } from '../models/entity-responsibilities.model'; // tslint:disable-line:no-unused-variable
import { GroupedEntities } from '../models/grouped-entities.model';
import { MyPerformanceApiService } from './my-performance-api.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PerformanceTransformerService } from './performance-transformer.service';
import { ResponsibilitiesTransformerService } from './responsibilities-transformer.service';
import { ViewType } from '../enums/view-type.enum';

export interface ResponsibilitiesData {
  groupedEntities?: GroupedEntities;
  viewType?: ViewType;
  entityTypes?: Array<{ type: string, name: string }>;
  entitiesURL?: string;
  positionId?: string;
  filter?: MyPerformanceFilterState;
  entitiesPerformances?: Array<EntitiesPerformances>;
}

@Injectable()
export class ResponsibilitiesService {

  constructor(
    private myPerformanceApiService: MyPerformanceApiService,
    private performanceTransformerService: PerformanceTransformerService,
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService
  ) { }

  public getResponsibilities(responsibilitiesData: ResponsibilitiesData)
    : Observable<ResponsibilitiesData> {
      return this.myPerformanceApiService.getResponsibilities(responsibilitiesData.positionId)
      .map((response: PeopleResponsibilitiesDTO) => {
        let groupedEntities: GroupedEntities;
        let viewType: ViewType;
        let entityTypes: Array<{ type: string, name: string }>;
        let entitiesURL: string;

        if (response.positions) {
          viewType = ViewType.roleGroups;

          groupedEntities = this.responsibilitiesTransformerService.groupPeopleByGroupedEntities(response.positions);
          entityTypes = Object.keys(groupedEntities).map((roleGroup: string) => {
            return {
              type: groupedEntities[roleGroup][0].type,
              name: roleGroup
            };
          });
        } else {
          if (response.entityURIs) {
            viewType = response.entityURIs[0].search('distributors') !== -1
              ? ViewType.distributors
              : ViewType.accounts;

            entitiesURL = response.entityURIs[0];
          }
        }

        return Object.assign({}, responsibilitiesData, {
          groupedEntities: groupedEntities,
          viewType: viewType,
          entityTypes: entityTypes,
          entitiesURL: entitiesURL
        });
      });
    }

  public getResponsibilitiesPerformanceTotals(
    entities: Array<{ positionId?: string, type: string, name: string }>, filter: MyPerformanceFilterState, positionId?: string
  ): Observable<(EntitiesPerformances | Error)[]> {
    const apiCalls: Observable<EntitiesPerformancesDTO | Error>[] = [];

    entities.forEach((entity: { positionId?: string, type: string, name: string }) => {
      apiCalls.push(this.myPerformanceApiService.getResponsibilityPerformanceTotal(entity, filter, entity.positionId || positionId));
    });

    return Observable.forkJoin(apiCalls)
      .switchMap((response: EntitiesPerformancesDTO[]) => {
        return Observable.of(this.performanceTransformerService.transformEntitiesPerformancesDTOs(response));
      });
  }

  public getPerformanceTotal(
    positionId: string,
    filter: MyPerformanceFilterState
  ): Observable<EntitiesTotalPerformances> {
    return this.myPerformanceApiService.getPerformanceTotal(positionId, filter)
      .map((response: EntitiesTotalPerformancesDTO) => {
        return this.performanceTransformerService.transformEntitiesTotalPerformancesDTO(response);
      });
  }

  public getDistributorsPerformances(distributors: EntityResponsibilities[], filter: MyPerformanceFilterState) {
    const apiCalls: Observable<EntitiesTotalPerformancesDTO | Error>[] =
      distributors.map((dist: EntityResponsibilities) => this.myPerformanceApiService.getDistributorPerformance(dist.positionId, filter));

    return Observable.forkJoin(apiCalls);
  }

  public getAccountsPerformances(accounts: EntityResponsibilities[], filter: MyPerformanceFilterState) {
    const apiCalls: Observable<EntitiesTotalPerformancesDTO | Error>[] =
      accounts.map((acc: EntityResponsibilities) => this.myPerformanceApiService.getAccountPerformance(acc.positionId, filter));

    return Observable.forkJoin(apiCalls);
  }

  public getPerformanceTotalForGroupedEntities(responsibilitiesData: ResponsibilitiesData)
  : Observable<ResponsibilitiesData> {
  if (responsibilitiesData.viewType === ViewType.roleGroups) {
    return this.getResponsibilitiesPerformanceTotals(responsibilitiesData.entityTypes,
      responsibilitiesData.filter,
      responsibilitiesData.positionId)
    .switchMap((entityPerformances: EntitiesPerformances[]) => {
      responsibilitiesData.entitiesPerformances = entityPerformances;
      return Observable.of(responsibilitiesData);
    });
  } else if (responsibilitiesData.viewType === ViewType.distributors) {
    return this.getDistributorsPerformances(responsibilitiesData.groupedEntities.all,
        responsibilitiesData.filter)
      .mergeMap((response: EntitiesTotalPerformancesDTO[]) => {
        responsibilitiesData.entitiesPerformances
          = this.performanceTransformerService
            .transformEntityDTOsWithPerformance(response, responsibilitiesData.groupedEntities.all);
        return Observable.of(responsibilitiesData);
    });
  } else if (responsibilitiesData.viewType === ViewType.accounts) {
    return this.getAccountsPerformances(responsibilitiesData.groupedEntities.all,
        responsibilitiesData.filter)
      .mergeMap((response: EntitiesTotalPerformancesDTO[]) => {
        responsibilitiesData.entitiesPerformances
          = this.performanceTransformerService
            .transformEntityDTOsWithPerformance(response, responsibilitiesData.groupedEntities.all);
        return Observable.of(responsibilitiesData);
    });
  } else {
    return Observable.of(responsibilitiesData);
  }
}

  public getAccountsDistributors(responsibilitiesData: ResponsibilitiesData)
    : Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.distributors || responsibilitiesData.viewType === ViewType.accounts) {
      return this.myPerformanceApiService.getAccountsDistributors(responsibilitiesData.entitiesURL)
        .switchMap((accountsOrDistributors: Array<EntityDTO>): Observable<ResponsibilitiesData> => {
        const groupedEntities = this.responsibilitiesTransformerService.groupsAccountsDistributors(accountsOrDistributors);
        return Observable.of(Object.assign({}, responsibilitiesData, {
          groupedEntities: groupedEntities
        }));
      });
    } else {
      return Observable.of(responsibilitiesData);
    }
  }
}
