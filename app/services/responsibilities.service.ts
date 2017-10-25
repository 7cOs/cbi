import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { EntityDTO } from '../models/entity-dto.model';
import { EntityPeopleType, EntityType, HierarchyGroupTypeCode } from '../enums/entity-responsibilities.enum';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { FetchEntityWithPerformancePayload } from '../state/actions/responsibilities.action';
import { GroupedEntities } from '../models/grouped-entities.model';
import { HierarchyEntity } from '../models/hierarchy-entity.model';
import { HierarchyEntityDTO } from '../models/hierarchy-entity.model';
import { HierarchyGroup } from '../models/hierarchy-group.model';
import { MyPerformanceApiService } from './my-performance-api.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { PerformanceTransformerService } from './performance-transformer.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ResponsibilitiesTransformerService } from './responsibilities-transformer.service';
import { SalesHierarchyViewType } from '../enums/sales-hierarchy-view-type.enum';

const CORPORATE_USER_POSITION_ID = '0';

export interface ResponsibilitiesData {
  groupedEntities?: GroupedEntities;
  salesHierarchyViewType?: SalesHierarchyViewType;
  hierarchyGroups?: Array<HierarchyGroup>;
  entitiesURL?: string;
  alternateEntitiesURL?: string;
  positionId?: string;
  alternateHierarchyId?: string;
  entityTypeCode?: string;
  filter?: MyPerformanceFilterState;
  entityWithPerformance?: Array<EntityWithPerformance>;
  entities?: HierarchyEntity[];
}

export interface SubAccountData {
  positionId: string;
  contextPositionId: string;
  entityTypeAccountName: string;
  groupedEntities?: GroupedEntities;
  entityWithPerformance?: Array<EntityWithPerformance>;
  selectedPositionId: string;
  filter: MyPerformanceFilterState;
  premiseType?: PremiseTypeValue;
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
        if (response.positions) {
          return this.handleResponsibilitiesPositionsResponse(response.positions, responsibilitiesData);
        } else if (response.entityURIs) {
          return Object.assign({}, responsibilitiesData, this.handleResponsibilitiesEntityURIResponse(response.entityURIs));
        }
      });
  }

  public getAlternateHierarchyResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    return this.myPerformanceApiService.getAlternateHierarchy(responsibilitiesData.positionId, responsibilitiesData.alternateHierarchyId)
      .map((response: PeopleResponsibilitiesDTO) => {
        if (response.positions) {
          return this.handleResponsibilitiesPositionsResponse(response.positions, responsibilitiesData);
        } else if (response.entityURIs) {
          return Object.assign({}, responsibilitiesData, this.handleResponsibilitiesEntityURIResponse(response.entityURIs));
        }
      });
  }

  public getHierarchyGroupsPerformances(entities: Array<HierarchyGroup>,
    filter: MyPerformanceFilterState, positionId: string, alternateHierarchyId?: string)
  : Observable<EntityWithPerformance[]> {
    const apiCalls: Observable<EntityWithPerformance>[] = entities.map((group: HierarchyGroup) => {
      const fetchGroupPerformanceCall = group.alternateHierarchyId || alternateHierarchyId
        ? this.myPerformanceApiService.getAlternateHierarchyGroupPerformance(group, positionId,
            group.alternateHierarchyId || alternateHierarchyId, filter)
        : this.myPerformanceApiService.getHierarchyGroupPerformance(group, filter, positionId);

      return fetchGroupPerformanceCall
        .map((response: PerformanceDTO) => {
          return this.performanceTransformerService.transformHierarchyGroupPerformance(response, group, positionId);
        })
        .catch(() => {
          this.toastService.showPerformanceDataErrorToast();
          return Observable.of(this.performanceTransformerService.transformHierarchyGroupPerformance(null, group, positionId));
        });
    });

    return Observable.forkJoin(apiCalls);
  }

  public getPositionsPerformances(entities: HierarchyEntity[], filter: MyPerformanceFilterState, alternateHierarchyId?: string) {
    const apiCalls: Observable<EntityWithPerformance>[] =
      entities.map((entity: HierarchyEntity) => {
        const performanceCall = alternateHierarchyId
          ? this.myPerformanceApiService.getAlternateHierarchyPersonPerformance(entity.positionId, alternateHierarchyId, filter)
          : this.myPerformanceApiService.getPerformance(entity.positionId, filter);

        return performanceCall.map((response: PerformanceDTO) => {
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
    const apiCalls: Observable<EntityWithPerformance>[] = distributors.map((distributor: HierarchyEntity) => {
        return this.myPerformanceApiService.getDistributorPerformance(distributor.positionId, filter, contextPositionId)
          .map((response: PerformanceDTO) => this.performanceTransformerService.transformEntityWithPerformance(response, distributor))
          .catch(() => {
            this.toastService.showPerformanceDataErrorToast();
            return Observable.of(this.performanceTransformerService.transformEntityWithPerformance(null, distributor));
          });
    });

    return Observable.forkJoin(apiCalls);
  }

  public getAccountsPerformances(accounts: HierarchyEntity[], filter: MyPerformanceFilterState, contextPositionId?: string) {
    const apiCalls: Observable<EntityWithPerformance>[] = accounts.map((account: HierarchyEntity) => {
        return this.myPerformanceApiService.getAccountPerformance(account.positionId, filter, contextPositionId)
          .map((response: PerformanceDTO) => this.performanceTransformerService.transformEntityWithPerformance(response, account))
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
    if (responsibilitiesData.salesHierarchyViewType === SalesHierarchyViewType.roleGroups) {
      return this.handleResponsibilitiesPerformances(responsibilitiesData);
    } else if (responsibilitiesData.salesHierarchyViewType === SalesHierarchyViewType.distributors) {
      return this.handleDistributorsPerformances(responsibilitiesData);
    } else if (responsibilitiesData.salesHierarchyViewType === SalesHierarchyViewType.accounts) {
      return this.handleAccountsPerformances(responsibilitiesData);
    } else {
      return Observable.of(responsibilitiesData);
    }
  }

  public getAccountsDistributors(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    if (responsibilitiesData.salesHierarchyViewType === SalesHierarchyViewType.distributors
      || responsibilitiesData.salesHierarchyViewType === SalesHierarchyViewType.accounts) {
      return this.myPerformanceApiService.getAccountsDistributors(responsibilitiesData.entitiesURL)
        .switchMap((accountsOrDistributors: Array<EntityDTO>): Observable<ResponsibilitiesData> => {
          const hierarchyGroups: Array<HierarchyGroup> = [{
            name: accountsOrDistributors[0].type.toUpperCase(),
            type: accountsOrDistributors[0].type === EntityType.Distributor
              ? HierarchyGroupTypeCode.distributors
              : HierarchyGroupTypeCode.accounts,
            entityType: accountsOrDistributors[0].type === EntityType.Distributor ? EntityType.DistributorGroup : EntityType.AccountGroup
          }];
          const groupedEntities: GroupedEntities = this.responsibilitiesTransformerService.groupsAccountsDistributors(
            accountsOrDistributors,
            EntityPeopleType[accountsOrDistributors[0].type.toUpperCase()]
          );

          return Observable.of(Object.assign({}, responsibilitiesData, {
            hierarchyGroups: hierarchyGroups,
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
    return this.myPerformanceApiService.getAlternateHierarchy(responsibilitiesData.positionId, responsibilitiesData.positionId)
      .switchMap((response: PeopleResponsibilitiesDTO) => {
        if (response.positions) {
          const alternateHierarchyGroup: HierarchyGroup = {
            name: EntityPeopleType.GEOGRAPHY,
            type: response.positions[0].type,
            entityType: EntityType.RoleGroup,
            alternateHierarchyId: responsibilitiesData.positionId
          };
          const hierarchyGroups: Array<HierarchyGroup> = responsibilitiesData.hierarchyGroups.concat([alternateHierarchyGroup]);
          const transformedPositions: HierarchyEntity[] =
            this.responsibilitiesTransformerService.transformHierarchyEntityDTOCollection(response.positions);
          const groupedEntities: GroupedEntities = Object.assign({}, responsibilitiesData.groupedEntities, {
            [EntityPeopleType.GEOGRAPHY]: transformedPositions
          });

          return Observable.of(Object.assign({}, responsibilitiesData, {
            hierarchyGroups: hierarchyGroups,
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
          const alternateHierarchyGroup: HierarchyGroup = {
            name: EntityPeopleType.GEOGRAPHY,
            type: response[0].type === EntityType.Distributor ? HierarchyGroupTypeCode.distributors : HierarchyGroupTypeCode.accounts,
            entityType: response[0].type === EntityType.Distributor ? EntityType.DistributorGroup : EntityType.AccountGroup,
            alternateHierarchyId: responsibilitiesData.positionId
          };
          const hierarchyGroups: Array<HierarchyGroup> = responsibilitiesData.hierarchyGroups.concat([alternateHierarchyGroup]);

          return Observable.of(Object.assign({}, responsibilitiesData, {
            hierarchyGroups: hierarchyGroups,
            groupedEntities: groupedEntities,
            salesHierarchyViewType: SalesHierarchyViewType.roleGroups
          }));
        });
    } else {
      return Observable.of(responsibilitiesData);
    }
  }

  public getEntitiesWithPerformanceForGroup(payload: FetchEntityWithPerformancePayload): Observable<(EntityWithPerformance | Error)[]> {
    switch (payload.entityType) {
      case EntityType.RoleGroup:
        return payload.alternateHierarchyId
          ? this.getPositionsPerformances(payload.entities, payload.filter, payload.alternateHierarchyId)
          : this.getPositionsPerformances(payload.entities, payload.filter);
      case EntityType.DistributorGroup:
        return payload.alternateHierarchyId
          ? this.getDistributorsPerformances(payload.entities, payload.filter, CORPORATE_USER_POSITION_ID)
          : this.getDistributorsPerformances(payload.entities, payload.filter, payload.selectedPositionId);
      case EntityType.AccountGroup:
        return this.getAccountsPerformances(payload.entities, payload.filter, payload.selectedPositionId);
      default:
        throw new Error(`[getEntitiesWithPerformanceForGroup]: EntityType of ${ payload.entityType } is not supported.`);
    }
  }

  public getEntityGroupViewType(type: EntityType): SalesHierarchyViewType {
    switch (type) {
      case EntityType.ResponsibilitiesGroup:
        return SalesHierarchyViewType.roleGroups;
      case EntityType.RoleGroup:
        return SalesHierarchyViewType.people;
      case EntityType.DistributorGroup:
        return SalesHierarchyViewType.distributors;
      case EntityType.AccountGroup:
        return SalesHierarchyViewType.accounts;
      default:
        throw new Error(`[getEntityGroupViewType]: EntityType of ${ type } is not supported.`);
    }
  }

  public checkEmptyResponsibilitiesResponse(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    if (responsibilitiesData && Object.keys(responsibilitiesData.groupedEntities).length === 0) {
      return Observable.throw('Empty ResponsibilitiesData Error');
    }
    return Observable.of(responsibilitiesData);
  }

  public checkEmptySubaccountsResponse(subAccountsData: SubAccountData): Observable<SubAccountData> {
    if (subAccountsData && Object.keys(subAccountsData.groupedEntities).length === 0) {
      return Observable.throw('Empty SubAccountData Error');
    }
    return Observable.of(subAccountsData);
  }

  private handleResponsibilitiesPerformances(responsibilitiesData: ResponsibilitiesData) {
    const fetchPerformanceCall = responsibilitiesData.alternateHierarchyId
      ? this.getHierarchyGroupsPerformances(responsibilitiesData.hierarchyGroups, responsibilitiesData.filter,
          responsibilitiesData.positionId, responsibilitiesData.alternateHierarchyId)
      : this.getHierarchyGroupsPerformances(responsibilitiesData.hierarchyGroups, responsibilitiesData.filter,
          responsibilitiesData.positionId);

    return fetchPerformanceCall.map((entityPerformances: EntityWithPerformance[]) => {
      return Object.assign({}, responsibilitiesData, {
        entityWithPerformance: entityPerformances
      });
    });
   }

  private handleDistributorsPerformances(responsibilitiesData: ResponsibilitiesData) {
    const contextPositionId: string = responsibilitiesData.alternateHierarchyId
      ? CORPORATE_USER_POSITION_ID
      : responsibilitiesData.positionId;

    return this.getDistributorsPerformances(
      responsibilitiesData.groupedEntities[EntityPeopleType.DISTRIBUTOR],
      responsibilitiesData.filter,
      contextPositionId)
        .map((entityPerformances: EntityWithPerformance[]) => {
          responsibilitiesData.entityWithPerformance = entityPerformances;
          return responsibilitiesData;
        });
  }

  private handleAccountsPerformances(responsibilitiesData: ResponsibilitiesData) {
    return this.getAccountsPerformances(
      responsibilitiesData.groupedEntities[EntityPeopleType.ACCOUNT],
      responsibilitiesData.filter,
      responsibilitiesData.positionId)
        .map((entityPerformances: EntityWithPerformance[]) => {
          responsibilitiesData.entityWithPerformance = entityPerformances;
          return responsibilitiesData;
        });
  }

  private getHierarchyRoleGroups(groupedEntities: GroupedEntities, entityType: EntityType): Array<HierarchyGroup> {
    return Object.keys(groupedEntities).map((groupName: string) => {
      return {
        type: groupedEntities[groupName][0].type,
        name: groupName,
        entityType: EntityType[entityType],
        positionDescription: groupedEntities[groupName][0].positionDescription
      };
    });
  }

  private handleResponsibilitiesPositionsResponse(positions: Array<HierarchyEntityDTO>, responsibilitiesData: ResponsibilitiesData)
  : ResponsibilitiesData {
    const groupedEntities: GroupedEntities =
      this.responsibilitiesTransformerService.groupPeopleByGroupedEntities(positions);
    const hierarchyGroups: Array<HierarchyGroup> = this.getHierarchyRoleGroups(groupedEntities, EntityType.RoleGroup);

    return Object.assign({}, responsibilitiesData, {
      groupedEntities: groupedEntities,
      hierarchyGroups: hierarchyGroups,
      salesHierarchyViewType: SalesHierarchyViewType.roleGroups
    });
  }

  private handleResponsibilitiesEntityURIResponse(entityURIArray: string[]): ResponsibilitiesData {
    return {
      entitiesURL: entityURIArray[0],
      salesHierarchyViewType: entityURIArray[0].search('distributors') !== -1
        ? SalesHierarchyViewType.distributors
        : SalesHierarchyViewType.accounts
    };
  }
}
