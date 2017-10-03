import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { EntityDTO } from '../models/entity-dto.model';
import { EntityPeopleType, EntityType } from '../enums/entity-responsibilities.enum';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { FetchEntityWithPerformancePayload } from '../state/actions/responsibilities.action';
import { GroupedEntities } from '../models/grouped-entities.model';
import { HierarchyEntity, HierarchyEntityDTO } from '../models/hierarchy-entity.model';
import { MyPerformanceApiService } from './my-performance-api.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { PerformanceTransformerService } from './performance-transformer.service';
import { ResponsibilitiesTransformerService } from './responsibilities-transformer.service';
import { ViewType } from '../enums/view-type.enum';

export interface ResponsibilitiesData {
  groupedEntities?: GroupedEntities;
  viewType?: ViewType;
  entityTypes?: Array<{ type: string, name: string, entityType: EntityType, positionDescription: string }>;
  entitiesURL?: string;
  alternateEntitiesURL?: string;
  positionId?: string;
  entityTypeCode?: string;
  filter?: MyPerformanceFilterState;
  entityWithPerformance?: Array<EntityWithPerformance>;
  entities?: HierarchyEntityDTO[];
}

export interface SubAccountData {
  positionId: string;
  contextPositionId: string;
  entityTypeAccountName: string;
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
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService,
    @Inject('toastService') private toastService: any
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
              entityType: EntityType.RoleGroup,
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

  public groupResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    let entityTypes: Array<{ type: string, name: string, entityType: EntityType, positionDescription: string }>;

    const groupedEntities: GroupedEntities =
      this.responsibilitiesTransformerService.groupPeopleByGroupedEntities(responsibilitiesData.entities);

    entityTypes = Object.keys(groupedEntities).map((roleGroup: string) => {
      return {
        type: groupedEntities[roleGroup][0].type,
        name: roleGroup,
        entityType: EntityType.RoleGroup,
        positionDescription: groupedEntities[roleGroup][0].positionDescription
      };
    });

    return Observable.of(Object.assign({}, responsibilitiesData, {
      entityTypes: entityTypes,
      groupedEntities: groupedEntities,
      viewType: ViewType.roleGroups
    }));
  }

  public getResponsibilitiesPerformances(
    entities: Array<{ positionId?: string, type: string, name: string, positionDescription?: string }>,
    filter: MyPerformanceFilterState,
    positionId?: string
  ): Observable<(EntityWithPerformance | Error)[]> {
    const apiCalls: Observable<EntityWithPerformanceDTO | Error>[] = [];
    entities.forEach((entity: {
      positionId?: string, type: string, name: string, entityType: EntityType, positionDescription: string
    }) => {
      apiCalls.push(this.myPerformanceApiService.getResponsibilityPerformance(entity, filter, entity.positionId || positionId));
    });

    return Observable.forkJoin(apiCalls)
      .switchMap((response: EntityWithPerformanceDTO[]) => {
        return Observable.of(this.performanceTransformerService.transformEntityWithPerformanceDTOs(response));
      });
  }

  public getPositionsPerformances(entities: HierarchyEntity[], filter: MyPerformanceFilterState) {
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      entities.map((entity: HierarchyEntity) => {
        return this.myPerformanceApiService.getPerformance(entity.positionId, filter)
          .map((response: PerformanceDTO) => {
            return this.performanceTransformerService.transformEntityWithPerformance(response, entity);
          })
          .catch(() => {
            this.toastService.showPerformanceDataErrorToast();
            return Observable.of(this.performanceTransformerService.transformEntityWithPerformance(null, entity));
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
          })
          .catch(() => {
            this.toastService.showPerformanceDataErrorToast();
            return Observable.of(this.performanceTransformerService.transformEntityWithPerformance(null, distributor));
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
          })
          .catch(() => {
            this.toastService.showPerformanceDataErrorToast();
            return Observable.of(this.performanceTransformerService.transformEntityWithPerformance(null, account));
          });
      });

    return Observable.forkJoin(apiCalls);
  }

  public getSubAccountsPerformances(subAccountData: SubAccountData): Observable<SubAccountData> {
    const subAccounts = subAccountData.groupedEntities[subAccountData.entityTypeAccountName]
      .map((subAccount: HierarchyEntity) => subAccount);
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      subAccounts.map((subAccount: HierarchyEntity) => {
        return this.myPerformanceApiService.getSubAccountPerformance(subAccount.positionId, subAccountData.contextPositionId,
          subAccountData.filter)
          .map((response: PerformanceDTO) => {
            return this.performanceTransformerService.transformEntityWithPerformance(response, subAccount);
          })
          .catch(() => {
            this.toastService.showPerformanceDataErrorToast();
            return Observable.of(this.performanceTransformerService.transformEntityWithPerformance(null, subAccount));
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

  public getPerformanceForGroupedEntities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
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

  public getAccountsDistributors(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.distributors || responsibilitiesData.viewType === ViewType.accounts) {
      return this.myPerformanceApiService.getAccountsDistributors(responsibilitiesData.entitiesURL)
        .switchMap((accountsOrDistributors: Array<EntityDTO>): Observable<ResponsibilitiesData> => {
          const entityTypes: Array<{ name: string, entityType: EntityType, type: string }> = [{
            name: accountsOrDistributors[0].type.toUpperCase(),
            type: responsibilitiesData.positionId,
            entityType: accountsOrDistributors[0].type === 'Distributor' ? EntityType.DistributorGroup : EntityType.AccountGroup
          }];
          const groupedEntities: GroupedEntities = this.responsibilitiesTransformerService.groupsAccountsDistributors(
            accountsOrDistributors,
            accountsOrDistributors[0].type.toUpperCase()
          );

          return Observable.of(Object.assign({}, responsibilitiesData, {
            entityTypes: entityTypes,
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
          this.responsibilitiesTransformerService.transformSubAccountsDTO(response, subAccountData.entityTypeAccountName);

        return Object.assign({}, subAccountData, {
          groupedEntities: groupedEntities
        });
      });
  }

  public getAlternateHierarchy(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    return this.myPerformanceApiService.getAlternateHierarchy(responsibilitiesData.positionId)
      .switchMap((response: PeopleResponsibilitiesDTO) => {
        if (response.positions) {
          const entityTypes: Array<{ name: string, entityType: EntityType, type: string }> = [{
            name: 'GEOGRAPHY',
            type: responsibilitiesData.positionId,
            entityType: EntityType.ResponsibilitiesGroup
          }].concat(responsibilitiesData.entityTypes);
          const groupedEntities: GroupedEntities = Object.assign({}, responsibilitiesData.groupedEntities, {
            GEOGRAPHY: response.positions
          });

          return Observable.of(Object.assign({}, responsibilitiesData, {
            entityTypes: entityTypes,
            groupedEntities: groupedEntities
          }));
        } else if (response.entityURIs && response.entityURIs.length) {
          return Observable.of(Object.assign({}, responsibilitiesData, {
            alternateEntitiesURL: response.entityURIs[0]
          }));
        } else {
          return Observable.of(responsibilitiesData);
        }
    });
  }

  public getAlternateAccountsDistributors(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    if (responsibilitiesData.alternateEntitiesURL) {
      return this.myPerformanceApiService.getAccountsDistributors(responsibilitiesData.alternateEntitiesURL)
        .switchMap((response: Array<EntityDTO>) => {
          const groupedEntities = Object.assign({}, responsibilitiesData.groupedEntities,
            this.responsibilitiesTransformerService.groupsAccountsDistributors(response, EntityPeopleType.GEOGRAPHY));
          const geographyEntityType: string = EntityPeopleType.GEOGRAPHY;
          const entityTypes: Array<{ name: string, type: string, entityType: EntityType }> = [{
            name: geographyEntityType,
            type: responsibilitiesData.positionId,
            entityType: response[0].type === 'Distributor' ? EntityType.DistributorGroup : EntityType.AccountGroup
          }].concat(responsibilitiesData.entityTypes);

          return Observable.of(Object.assign({}, responsibilitiesData, {
            entityTypes: entityTypes,
            groupedEntities: groupedEntities,
            viewType: ViewType.roleGroups
          }));
        });
    } else {
      return Observable.of(responsibilitiesData);
    }
  }

  public getGroupsPerformanceEntities(payload: FetchEntityWithPerformancePayload): Observable<(EntityWithPerformance | Error)[]> {
    switch (payload.type) {
      case EntityType.RoleGroup:
        return this.getPositionsPerformances(payload.entities, payload.filter);
      case EntityType.DistributorGroup:
        return this.getDistributorsPerformances(payload.entities, payload.filter, payload.selectedPositionId);
      case EntityType.AccountGroup:
        return this.getAccountsPerformances(payload.entities, payload.filter, payload.selectedPositionId);
      default:
        throw new Error(`[getGroupsPerformanceEntities]: EntityType of ${ payload.type } is not supported.`);
    }
  }

  public getEntityGroupViewType(type: EntityType): ViewType {
    switch (type) {
      case EntityType.ResponsibilitiesGroup:
        return ViewType.roleGroups;
      case EntityType.RoleGroup:
        return ViewType.people;
      case EntityType.DistributorGroup:
        return ViewType.distributors;
      case EntityType.AccountGroup:
        return ViewType.accounts;
      default:
        throw new Error(`[getEntityGroupViewType]: EntityType of ${ type } is not supported.`);
    }
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
      responsibilitiesData.groupedEntities.DISTRIBUTOR,
      responsibilitiesData.filter,
      responsibilitiesData.positionId)
        .map((entityPerformances: EntityWithPerformance[]) => {
          responsibilitiesData.entityWithPerformance = entityPerformances;
          return responsibilitiesData;
        });
  }

  private handleAccountsPerformances(responsibilitiesData: ResponsibilitiesData) {
    return this.getAccountsPerformances(
      responsibilitiesData.groupedEntities.ACCOUNT,
      responsibilitiesData.filter,
      responsibilitiesData.positionId)
        .map((entityPerformances: EntityWithPerformance[]) => {
          responsibilitiesData.entityWithPerformance = entityPerformances;
          return responsibilitiesData;
        });
  }
}
