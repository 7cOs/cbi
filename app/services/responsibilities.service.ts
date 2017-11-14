import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { EntityDTO } from '../models/entity-dto.model';
import { EntityPeopleType, EntityType, HierarchyGroupTypeCode } from '../enums/entity-responsibilities.enum';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { EntityWithPerformance } from '../models/entity-with-performance.model';
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
import { SkuPackageType } from '../enums/sku-package-type.enum';

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
  brandSkuCode?: string;
  skuPackageType?: SkuPackageType;
  entityWithPerformance?: Array<EntityWithPerformance>;
  entities?: HierarchyEntity[];
  selectedEntityDescription?: string;
}

export interface FetchEntityWithPerformanceData {
  entityTypeGroupName: EntityPeopleType;
  entityTypeCode: string;
  entities: HierarchyEntity[];
  filter: MyPerformanceFilterState;
  positionId: string;
  alternateHierarchyId?: string;
  entityType: EntityType;
  brandSkuCode?: string;
  skuPackageType?: SkuPackageType;
  entityWithPerformance?: Array<EntityWithPerformance>;
  selectedEntityDescription?: string;
}

export interface RefreshAllPerformancesData {
  // Common
  positionId: string;
  filter: MyPerformanceFilterState;
  brandSkuCode?: string;
  skuPackageType?: SkuPackageType;
  groupedEntities?: GroupedEntities;
  alternateHierarchyId?: string;

  // roleGroups only
  hierarchyGroups?: Array<HierarchyGroup>; // TODO: check if it's not only for the unit tests (it seems so)

  // Person, Accounts, Distributors
  entityType: EntityType;
  salesHierarchyViewType: SalesHierarchyViewType;
  entities?: HierarchyEntity[];

  // results:
  entityWithPerformance?: Array<EntityWithPerformance>;
}

export interface RefreshTotalPerformanceData {
  // Common
  positionId: string;
  filter: MyPerformanceFilterState;
  brandSkuCode?: string;
  skuPackageType?: SkuPackageType;
  groupedEntities?: GroupedEntities;
  alternateHierarchyId?: string;

  // For roleGroups only
  hierarchyGroups?: Array<HierarchyGroup>;

  // For Person, Accounts, Distributors
  entityType: EntityType;
  salesHierarchyViewType: SalesHierarchyViewType;

  // For Subaccounts only
  accountPositionId?: string;

  // results:
  entitiesTotalPerformances?: Performance;
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
  brandSkuCode?: string;
  skuPackageType?: SkuPackageType;
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

  public getHierarchyGroupsPerformances(
    hierarchyGroups: Array<HierarchyGroup>,
    filter: MyPerformanceFilterState,
    positionId: string,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType,
    alternateHierarchyId?: string)
  : Observable<EntityWithPerformance[]> {
    const apiCalls: Observable<EntityWithPerformance>[] = hierarchyGroups.map((group: HierarchyGroup) => {
      const fetchGroupPerformanceCall = group.alternateHierarchyId || alternateHierarchyId
        ? this.myPerformanceApiService.getAlternateHierarchyGroupPerformance(group.type, positionId,
            group.alternateHierarchyId || alternateHierarchyId, filter, brandSkuCode, skuPackageType)
        : this.myPerformanceApiService.getHierarchyGroupPerformance(group.type, filter, positionId, brandSkuCode, skuPackageType);

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

  public getPositionsPerformances(
    positions: HierarchyEntity[],
    filter: MyPerformanceFilterState,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType,
    alternateHierarchyId?: string) {
    const apiCalls: Observable<EntityWithPerformance>[] =
      positions.map((position: HierarchyEntity) => {
        const performanceCall = alternateHierarchyId
          ? this.myPerformanceApiService.getAlternateHierarchyPersonPerformance(position.positionId,
            alternateHierarchyId,
            filter,
            brandSkuCode,
            skuPackageType)
          : this.myPerformanceApiService.getPerformance(position.positionId, filter, brandSkuCode, skuPackageType);

        return performanceCall.map((response: PerformanceDTO) => {
          return this.performanceTransformerService.transformEntityWithPerformance(response, position);
        })
        .catch(() => {
          this.toastService.showPerformanceDataErrorToast();
          return Observable.of(this.performanceTransformerService.transformEntityWithPerformance(null, position));
        });
      });

    return Observable.forkJoin(apiCalls);
  }

  public getPerformance(positionId: string, filter: MyPerformanceFilterState, brandSkuCode?: string, skuPackageType?: SkuPackageType):
                        Observable<Performance> {
    return this.myPerformanceApiService.getPerformance(positionId, filter, brandSkuCode, skuPackageType)
      .map((response: PerformanceDTO) => {
        return this.performanceTransformerService.transformPerformanceDTO(response);
      });
  }

  public getDistributorsPerformances(
    distributors: HierarchyEntity[],
    filter: MyPerformanceFilterState,
    contextPositionId?: string,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType) {
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      distributors.map((distributor: HierarchyEntity) => {
        return this.myPerformanceApiService.getDistributorPerformance(distributor.positionId, filter, contextPositionId,
                                                                      brandSkuCode, skuPackageType)
          .map((response: PerformanceDTO) => this.performanceTransformerService.transformEntityWithPerformance(response, distributor))
          .catch(() => {
            this.toastService.showPerformanceDataErrorToast();
            return Observable.of(this.performanceTransformerService.transformEntityWithPerformance(null, distributor));
          });
    });

    return Observable.forkJoin(apiCalls);
  }

  public getAccountsPerformances(
    accounts: HierarchyEntity[],
    filter: MyPerformanceFilterState,
    contextPositionId?: string,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType) {
    const apiCalls: Observable<EntityWithPerformance>[] = accounts.map((account: HierarchyEntity) => {
        return this.myPerformanceApiService.getAccountPerformance(account.positionId, filter,
                                                                  contextPositionId, brandSkuCode, skuPackageType)
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
        return this.myPerformanceApiService
          .getSubAccountPerformance(subAccount.positionId,
            subAccountData.contextPositionId,
            subAccountData.filter,
            subAccountData.brandSkuCode,
            subAccountData.skuPackageType)
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

  public getSubAccountsRefreshedPerformances(refreshAllPerformancesData: RefreshAllPerformancesData)
    : Observable<RefreshAllPerformancesData> {
    const subAccounts = refreshAllPerformancesData.groupedEntities[Object.keys(refreshAllPerformancesData.groupedEntities)[0]]
      .map((subAccount: HierarchyEntity) => subAccount);
    const apiCalls: Observable<EntityWithPerformance | Error>[] =
      subAccounts.map((subAccount: HierarchyEntity) => {
        return this.myPerformanceApiService
          .getSubAccountPerformance(subAccount.positionId,
            refreshAllPerformancesData.positionId,
            refreshAllPerformancesData.filter,
            refreshAllPerformancesData.brandSkuCode,
            refreshAllPerformancesData.skuPackageType)
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
        return Object.assign({}, refreshAllPerformancesData, {
          entityWithPerformance: entityPerformances
        });
      });
  }

  public getRefreshedPerformances(refreshAllPerformancesData: RefreshAllPerformancesData)
    : Observable<ResponsibilitiesData | RefreshAllPerformancesData> {
      switch (refreshAllPerformancesData.salesHierarchyViewType) {
        case SalesHierarchyViewType.roleGroups:
        case SalesHierarchyViewType.accounts:
        case SalesHierarchyViewType.distributors:
          return this.getPerformanceForGroupedEntities(refreshAllPerformancesData);

        case SalesHierarchyViewType.subAccounts:
          return this.getSubAccountsRefreshedPerformances(refreshAllPerformancesData);

        case SalesHierarchyViewType.people:
        default:
          refreshAllPerformancesData = Object.assign({}, refreshAllPerformancesData, {
            entities: refreshAllPerformancesData.groupedEntities[Object.keys(refreshAllPerformancesData.groupedEntities)[0]]
          });
          return this.getEntitiesWithPerformanceForGroup(refreshAllPerformancesData);
      }
  }

  public getRefreshedTotalPerformance(refreshTotalPerformanceData: RefreshTotalPerformanceData)
  : Observable<RefreshTotalPerformanceData> {
    let performanceObservable: Observable<Performance>;

    switch (refreshTotalPerformanceData.salesHierarchyViewType) {
      case SalesHierarchyViewType.accounts:
        performanceObservable = this.getPerformance(
          refreshTotalPerformanceData.positionId,
          refreshTotalPerformanceData.filter,
          refreshTotalPerformanceData.brandSkuCode,
          refreshTotalPerformanceData.skuPackageType
        );
        break;

      case SalesHierarchyViewType.roleGroups:
        performanceObservable = this.getRefreshedRoleGroupsTotalPerformance(refreshTotalPerformanceData);
        break;

      case SalesHierarchyViewType.distributors:
        performanceObservable = this.getRefreshedDistributorTotalPerformance(refreshTotalPerformanceData);
        break;

      case SalesHierarchyViewType.subAccounts:
        performanceObservable = this.getAccountPerformances(
          refreshTotalPerformanceData.accountPositionId,
          refreshTotalPerformanceData.filter,
          refreshTotalPerformanceData.positionId,
          refreshTotalPerformanceData.brandSkuCode,
          refreshTotalPerformanceData.skuPackageType
        );
        break;

      case SalesHierarchyViewType.people:
      default:
        const hierarchyGroup = this.findHierarchyGroupFromGroupedEntities(
          refreshTotalPerformanceData.hierarchyGroups,
          refreshTotalPerformanceData.groupedEntities
        );

        performanceObservable = this.getHierarchyGroupPerformance(
          hierarchyGroup.type,
          refreshTotalPerformanceData.alternateHierarchyId,
          refreshTotalPerformanceData.filter,
          refreshTotalPerformanceData.positionId,
          refreshTotalPerformanceData.brandSkuCode,
          refreshTotalPerformanceData.skuPackageType
        );
        break;
    }

    return performanceObservable.map((response: Performance) => {
      return Object.assign({}, refreshTotalPerformanceData, {
        entitiesTotalPerformances: response
      });
    });
  }

  public getPerformanceForGroupedEntities(pipelineData: ResponsibilitiesData | RefreshAllPerformancesData)
    : Observable<ResponsibilitiesData | RefreshAllPerformancesData> {
    if (pipelineData.salesHierarchyViewType === SalesHierarchyViewType.roleGroups) {
      return this.handleResponsibilitiesPerformances(pipelineData);
    } else if (pipelineData.salesHierarchyViewType === SalesHierarchyViewType.distributors) {
      return this.handleDistributorsPerformances(pipelineData);
    } else if (pipelineData.salesHierarchyViewType === SalesHierarchyViewType.accounts) {
      return this.handleAccountsPerformances(pipelineData);
    } else {
      return Observable.of(pipelineData);
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

  public getEntitiesWithPerformanceForGroup(pipelineData: FetchEntityWithPerformanceData | RefreshAllPerformancesData)
    : Observable<FetchEntityWithPerformanceData | RefreshAllPerformancesData> {
    let entityWithPerformanceObservable: Observable<(EntityWithPerformance | Error)[]>;
    switch (pipelineData.entityType) {
      case EntityType.RoleGroup:
        entityWithPerformanceObservable = this.getPositionsPerformances(
          pipelineData.entities,
          pipelineData.filter,
          pipelineData.brandSkuCode,
          pipelineData.skuPackageType,
          pipelineData.alternateHierarchyId ? pipelineData.alternateHierarchyId : null
        );
        break;
      case EntityType.DistributorGroup:
        entityWithPerformanceObservable = this.getDistributorsPerformances(
          pipelineData.entities,
          pipelineData.filter,
          pipelineData.alternateHierarchyId ? CORPORATE_USER_POSITION_ID : pipelineData.positionId,
          pipelineData.brandSkuCode,
          pipelineData.skuPackageType
        );
        break;
      case EntityType.AccountGroup:
        entityWithPerformanceObservable = this.getAccountsPerformances(
          pipelineData.entities,
          pipelineData.filter,
          pipelineData.positionId,
          pipelineData.brandSkuCode,
          pipelineData.skuPackageType
        );
        break;
      default:
        throw new Error(`[getEntitiesWithPerformanceForGroup]: EntityType of ${ pipelineData.entityType } is not supported.`);
    }

    return entityWithPerformanceObservable.map((entityWithPerformance: EntityWithPerformance[]) => {
      return Object.assign({}, pipelineData, {
        entityWithPerformance: entityWithPerformance
      });
    });
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

  private getAccountPerformances(
    accountsId: string,
    filter: MyPerformanceFilterState,
    contextPositionId?: string,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType): Observable<Performance> {
    return this.myPerformanceApiService.getAccountPerformance(accountsId, filter, contextPositionId, brandSkuCode, skuPackageType)
      .map((response: PerformanceDTO) => this.performanceTransformerService.transformPerformanceDTO(response));
  }

  private handleResponsibilitiesPerformances(responsibilitiesData: ResponsibilitiesData | RefreshAllPerformancesData) {
    return this.getHierarchyGroupsPerformances(responsibilitiesData.hierarchyGroups,
      responsibilitiesData.filter,
      responsibilitiesData.positionId,
      responsibilitiesData.brandSkuCode,
      responsibilitiesData.skuPackageType,
      responsibilitiesData.alternateHierarchyId ? responsibilitiesData.alternateHierarchyId : null)
      .map((entityPerformances: EntityWithPerformance[]) => {
        return Object.assign({}, responsibilitiesData, {
          entityWithPerformance: entityPerformances
        });
      });
   }

  private handleDistributorsPerformances(responsibilitiesData: ResponsibilitiesData | RefreshAllPerformancesData) {
    const contextPositionId: string = responsibilitiesData.alternateHierarchyId
      ? CORPORATE_USER_POSITION_ID
      : responsibilitiesData.positionId;

    return this.getDistributorsPerformances(
      responsibilitiesData.groupedEntities[Object.keys(responsibilitiesData.groupedEntities)[0]],
      responsibilitiesData.filter,
      contextPositionId,
      responsibilitiesData.brandSkuCode,
      responsibilitiesData.skuPackageType)
      .map((entityPerformances: EntityWithPerformance[]) => {
        return Object.assign({}, responsibilitiesData, {
          entityWithPerformance: entityPerformances
        });
      });
  }

  private handleAccountsPerformances(responsibilitiesData: ResponsibilitiesData | RefreshAllPerformancesData) {
    return this.getAccountsPerformances(
      responsibilitiesData.groupedEntities[Object.keys(responsibilitiesData.groupedEntities)[0]],
      responsibilitiesData.filter,
      responsibilitiesData.positionId,
      responsibilitiesData.brandSkuCode,
      responsibilitiesData.skuPackageType)
      .map((entityPerformances: EntityWithPerformance[]) => {
        return Object.assign({}, responsibilitiesData, {
          entityWithPerformance: entityPerformances
        });
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

  private getHierarchyGroupPerformance(
    hierarchyGroupType: string,
    alternateHierarchyId: string,
    filter: MyPerformanceFilterState,
    positionId: string,
    brandSkuCode?: string,
    skuPackageType?: SkuPackageType)
  : Observable<Performance> {
    const fetchGroupPerformanceCall = alternateHierarchyId
      ? this.myPerformanceApiService.getAlternateHierarchyGroupPerformance(hierarchyGroupType, positionId,
          alternateHierarchyId, filter, brandSkuCode, skuPackageType)
      : this.myPerformanceApiService.getHierarchyGroupPerformance(hierarchyGroupType, filter, positionId, brandSkuCode, skuPackageType);

    return fetchGroupPerformanceCall
      .map((response: PerformanceDTO) => {
        return this.performanceTransformerService.transformPerformanceDTO(response);
      })
      .catch(() => {
        this.toastService.showPerformanceDataErrorToast();
        return Observable.of(this.performanceTransformerService.transformPerformanceDTO(null));
      });
  }

  private findHierarchyGroupFromGroupedEntities(hierarchyGroups: Array<HierarchyGroup>, groupedEntities: GroupedEntities): HierarchyGroup {
    const groupEntityKey = Object.keys(groupedEntities)[0];

    return hierarchyGroups.find((hierarchyGroup: HierarchyGroup) =>
      hierarchyGroup.name === groupEntityKey
    );
  }

  private getRefreshedDistributorTotalPerformance(refreshTotalPerformanceData: RefreshTotalPerformanceData): Observable<Performance> {
    let performanceObservable: Observable<Performance>;

    if (refreshTotalPerformanceData.alternateHierarchyId) {
      if (refreshTotalPerformanceData.entityType === EntityType.Person) {
        performanceObservable = this.myPerformanceApiService.getAlternateHierarchyPersonPerformance(
          refreshTotalPerformanceData.positionId,
          refreshTotalPerformanceData.alternateHierarchyId,
          refreshTotalPerformanceData.filter,
          refreshTotalPerformanceData.brandSkuCode,
          refreshTotalPerformanceData.skuPackageType)
          .map((performanceDTO: PerformanceDTO) => {
            return this.performanceTransformerService.transformPerformanceDTO(performanceDTO);
          });
      } else {
        const hierarchyGroup = this.findHierarchyGroupFromGroupedEntities(
          refreshTotalPerformanceData.hierarchyGroups,
          refreshTotalPerformanceData.groupedEntities
        );

        performanceObservable = this.getHierarchyGroupPerformance(
          hierarchyGroup.type,
          refreshTotalPerformanceData.alternateHierarchyId,
          refreshTotalPerformanceData.filter,
          refreshTotalPerformanceData.positionId,
          refreshTotalPerformanceData.brandSkuCode,
          refreshTotalPerformanceData.skuPackageType);
      }
    } else {
      performanceObservable = this.getPerformance(
        refreshTotalPerformanceData.positionId,
        refreshTotalPerformanceData.filter,
        refreshTotalPerformanceData.brandSkuCode,
        refreshTotalPerformanceData.skuPackageType);
    }

    return performanceObservable;
  }

    private getRefreshedRoleGroupsTotalPerformance(refreshTotalPerformanceData: RefreshTotalPerformanceData): Observable<Performance> {
      let performanceObservable: Observable<Performance>;

      if (refreshTotalPerformanceData.alternateHierarchyId) {
        performanceObservable = this.myPerformanceApiService.getAlternateHierarchyPersonPerformance(
          refreshTotalPerformanceData.positionId,
          refreshTotalPerformanceData.alternateHierarchyId,
          refreshTotalPerformanceData.filter,
          refreshTotalPerformanceData.brandSkuCode,
          refreshTotalPerformanceData.skuPackageType)
          .map((performanceDTO: PerformanceDTO) => {
            return this.performanceTransformerService.transformPerformanceDTO(performanceDTO);
          });
      } else {
        performanceObservable = this.getPerformance(
          refreshTotalPerformanceData.positionId,
          refreshTotalPerformanceData.filter,
          refreshTotalPerformanceData.brandSkuCode,
          refreshTotalPerformanceData.skuPackageType);
      }

    return performanceObservable;
  }
}
