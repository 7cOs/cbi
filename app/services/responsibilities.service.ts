import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { EntityDTO } from '../models/entity-dto.model';
import { HierarchyEntity } from '../models/hierarchy-entity.model'; // tslint:disable-line:no-unused-variable
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
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
  entityTypes?: Array<{ type: string, name: string, positionDescription: string }>;
  entitiesURL?: string;
  positionId?: string;
  filter?: MyPerformanceFilterState;
  entityWithPerformance?: Array<EntityWithPerformance>;
}

export interface SubAccountData {
  positionId: string;
  contextPositionId: string;
  entityType: string;
  groupedEntities?: GroupedEntities;
  entityWithPerformance?: Array<EntityWithPerformance>;
  selectedPositionId: string;
  filter: MyPerformanceFilterState;
}

@Injectable()
export class ResponsibilitiesService {

  constructor(
    private myPerformanceApiService: MyPerformanceApiService,
    private performanceTransformerService: PerformanceTransformerService,
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService
  ) { }

  public getResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    return this.myPerformanceApiService.getResponsibilities(responsibilitiesData.positionId)
      .map((response: PeopleResponsibilitiesDTO) => {
        let groupedEntities: GroupedEntities;
        let viewType: ViewType;
        let entityTypes: Array<{ type: string, name: string, positionDescription?: string }>;
        let entitiesURL: string;

        if (response.positions) {
          viewType = ViewType.roleGroups;

          groupedEntities = this.responsibilitiesTransformerService.groupPeopleByGroupedEntities(response.positions);
          entityTypes = Object.keys(groupedEntities).map((roleGroup: string) => {
            return {
              type: groupedEntities[roleGroup][0].type,
              name: roleGroup,
              positionDescription: groupedEntities[roleGroup][0].positionDescription
            };
          });
        } else if (response.entityURIs) {
          viewType = response.entityURIs[0].search('distributors') !== -1
            ? ViewType.distributors
            : ViewType.accounts;

          entitiesURL = response.entityURIs[0];
        }

        return Object.assign({}, responsibilitiesData, {
          groupedEntities: groupedEntities,
          viewType: viewType,
          entityTypes: entityTypes,
          entitiesURL: entitiesURL
        });
      });
  }

  public getResponsibilitiesPerformances(
    entities: Array<{ positionId?: string, type: string, name: string, positionDescription: string }>,
    filter: MyPerformanceFilterState,
    positionId?: string
  ): Observable<(EntityWithPerformance | Error)[]> {
    const apiCalls: Observable<EntityWithPerformanceDTO | Error>[] = [];

    entities.forEach((entity: { positionId?: string, type: string, name: string, positionDescription: string }) => {
      apiCalls.push(this.myPerformanceApiService.getResponsibilityPerformance(entity, filter, entity.positionId || positionId));
    });

    return Observable.forkJoin(apiCalls)
      .switchMap((response: EntityWithPerformanceDTO[]) => {
        return Observable.of(this.performanceTransformerService.transformEntityWithPerformanceDTOs(response));
      });
  }

  public getPositionsPerformances(
    entities: HierarchyEntity[],
    filter: MyPerformanceFilterState
  ) {
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      entities.map((entity: HierarchyEntity) => {
        return this.myPerformanceApiService.getPerformance(entity.positionId, filter)
          .map((response: PerformanceDTO) => {
            return this.performanceTransformerService.transformEntityWithPerformance(response, entity);
          });
      });

    return Observable.forkJoin(apiCalls);
  }

  public getPerformance(positionId: string, filter: MyPerformanceFilterState): Observable<Performance> {
    return this.myPerformanceApiService.getPerformance(positionId, filter)
      .map((response: PerformanceDTO) => {
        return this.performanceTransformerService.transformPerformanceDTO(response);
      });
  }

  public getDistributorsPerformances(distributors: HierarchyEntity[], filter: MyPerformanceFilterState, contextPositionId?: string) {
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      distributors.map((distributor: HierarchyEntity) => {
        return this.myPerformanceApiService.getDistributorPerformance(distributor.positionId, filter, contextPositionId)
          .map(response => {
            return this.performanceTransformerService.transformEntityWithPerformance(response, distributor);
          });
      });

    return Observable.forkJoin(apiCalls);
  }

  public getAccountsPerformances(accounts: HierarchyEntity[], filter: MyPerformanceFilterState, contextPositionId?: string) {
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      accounts.map((account: HierarchyEntity) => {
        return this.myPerformanceApiService.getAccountPerformance(account.positionId, filter, contextPositionId)
          .map(response => {
            return this.performanceTransformerService.transformEntityWithPerformance(response, account);
          });
      });

    return Observable.forkJoin(apiCalls);
  }

  public getSubAccountsPerformances(subAccountData: SubAccountData): Observable<SubAccountData> {
    const subAccounts = subAccountData.groupedEntities[subAccountData.entityType].map((subAccount: HierarchyEntity) => subAccount);
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      subAccounts.map((subAccount: HierarchyEntity) => {
        return this.myPerformanceApiService.getSubAccountsPerformance(subAccount.positionId, subAccountData.contextPositionId,
          subAccountData.filter)
          .map((response: PerformanceDTO) => {
            return this.performanceTransformerService.transformEntityWithPerformance(response, subAccount);
          });
      });

    return Observable.forkJoin(apiCalls)
      .map((entityPerformances: EntityWithPerformance[]) => {
        subAccountData.entityWithPerformance = entityPerformances;
        return Object.assign({}, subAccountData, {
          entityWithPerformance: entityPerformances
        });
      });
  }

  public getPerformanceForGroupedEntities(responsibilitiesData: ResponsibilitiesData)
  : Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.roleGroups) {
      return this.handleResponsibilitiesPerformances(responsibilitiesData);
    } else if (responsibilitiesData.viewType === ViewType.distributors) {
      return this.handleDistributorsPerformances(responsibilitiesData);
    } else if (responsibilitiesData.viewType === ViewType.accounts) {
      return this.handleAccountsPerformances(responsibilitiesData);
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

  public getSubAccounts(subAccountData: SubAccountData): Observable<SubAccountData> {
    return this.myPerformanceApiService.getSubAccounts(
      subAccountData.positionId, subAccountData.contextPositionId, subAccountData.filter.premiseType
    )
      .map((response: Array<EntitySubAccountDTO>) => {
        const groupedEntities: GroupedEntities =
          this.responsibilitiesTransformerService.transformSubAccountsDTO(response, subAccountData.entityType);

        return Object.assign({}, subAccountData, {
          groupedEntities: groupedEntities
        });
      });
  }

  private handleResponsibilitiesPerformances(responsibilitiesData: ResponsibilitiesData) {
    return this.getResponsibilitiesPerformances(responsibilitiesData.entityTypes,
      responsibilitiesData.filter,
      responsibilitiesData.positionId)
        .map((entityPerformances: EntityWithPerformance[]) => {
          responsibilitiesData.entityWithPerformance = entityPerformances;
          return responsibilitiesData;
        });
   }

  private handleDistributorsPerformances(responsibilitiesData: ResponsibilitiesData) {
    return this.getDistributorsPerformances(
      responsibilitiesData.groupedEntities.all,
      responsibilitiesData.filter,
      responsibilitiesData.positionId)
        .map((entityPerformances: EntityWithPerformance[]) => {
          responsibilitiesData.entityWithPerformance = entityPerformances;
          return responsibilitiesData;
        });
  }

  private handleAccountsPerformances(responsibilitiesData: ResponsibilitiesData) {
    return this.getAccountsPerformances(
      responsibilitiesData.groupedEntities.all,
      responsibilitiesData.filter,
      responsibilitiesData.positionId)
        .map((entityPerformances: EntityWithPerformance[]) => {
          responsibilitiesData.entityWithPerformance = entityPerformances;
          return responsibilitiesData;
        });
  }

}
