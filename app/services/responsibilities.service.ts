import * as Chance from 'chance';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { GroupedEntities } from '../models/grouped-entities.model';
import { MyPerformanceApiService } from './my-performance-api.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PerformanceTransformerService } from './performance-transformer.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ResponsibilitiesTransformerService } from './responsibilities-transformer.service';
import { ViewType } from '../enums/view-type.enum';

const chance = new Chance();

export interface ResponsibilitiesData {
  groupedEntities?: GroupedEntities;
  viewType?: ViewType;
  entityTypes?: Array<{ type: string, name: string }>;
  entitiesURL?: string;
  positionId?: string;
  filter?: MyPerformanceFilterState;
  entitiesPerformances?: Array<EntitiesPerformances>;
}

export interface SubAccountData {
  positionId: string;
  contextPositionId: string;
  entityType: string;
  premiseType: PremiseTypeValue;
  groupedEntities?: GroupedEntities;
  entitiesPerformances?: Array<EntitiesPerformances>;
  entitiesTotalPerformances: MyPerformanceTableRow;
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

  public getPerformanceTotalForGroupedEntities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.roleGroups) {
      return this.getResponsibilitiesPerformanceTotals(
        responsibilitiesData.entityTypes, responsibilitiesData.filter, responsibilitiesData.positionId
      )
      .switchMap((entityPerformances: EntitiesPerformances[]) => {
        responsibilitiesData.entitiesPerformances = entityPerformances;
        return Observable.of(responsibilitiesData);
      });
    } else {
      return Observable.of(responsibilitiesData);
    }
  }

  public getAccountsDistributors(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.distributors || responsibilitiesData.viewType === ViewType.accounts) {
      return this.myPerformanceApiService.getAccountsDistributors(responsibilitiesData.entitiesURL)
        .switchMap((accountsDistributors: Array<EntityDTO>) => {
          const groupedEntities = this.responsibilitiesTransformerService.groupsAccountsDistributors(accountsDistributors);

          // Temporary build fake performance total
          let entitiesPerformances = groupedEntities['all'].map((entity: EntityResponsibilities) => {
            return {
              positionId: entity.positionId,
              name: entity.name,
              performanceTotal: {
                total: chance.natural({max: 1000}),
                totalYearAgo: chance.natural({max: 1000}),
                totalYearAgoPercent: chance.natural({max: 100}),
                contributionToVolume: chance.natural({max: 100})
              }
            };
          });

          return Observable.of(Object.assign(responsibilitiesData, {
            groupedEntities: groupedEntities,
            entitiesPerformances: entitiesPerformances, // Temporary
          }));
        });
    } else {
      return Observable.of(responsibilitiesData);
    }
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
        return Observable.of(this.performanceTransformerService.transformEntitiesPerformancesDTO(response));
      });
  }

  public getPerformanceTotal(positionId: string, filter: MyPerformanceFilterState): Observable<EntitiesTotalPerformances> {
    return this.myPerformanceApiService.getPerformanceTotal(positionId, filter)
      .map((response: EntitiesTotalPerformancesDTO) => {
        return this.performanceTransformerService.transformEntitiesTotalPerformancesDTO(response);
      });
  }

  public getSubAccounts(subAccountData: SubAccountData): Observable<SubAccountData> {
    return this.myPerformanceApiService.getSubAccounts(
      subAccountData.positionId, subAccountData.contextPositionId, subAccountData.premiseType
    )
      .map((response: Array<EntitySubAccountDTO>) => {
        const groupedEntities: GroupedEntities = {
          [subAccountData.entityType]: this.responsibilitiesTransformerService.transformSubAccountsDTO(response)
        };

        return Object.assign({}, subAccountData, {
          groupedEntities: groupedEntities
        });
      });
  }

  public getSubAccountsPerformanceTotals(subAccountData: SubAccountData): Observable<SubAccountData> {
    // Mock SubAccount performance till next story
    const entitiesPerformancesMock: Array<EntitiesPerformances> = subAccountData.groupedEntities[subAccountData.entityType]
      .map((subAccount: EntityResponsibilities) => {
        return {
          positionId: subAccount.positionId,
          contextPositionId: subAccount.contextPositionId,
          name: subAccount.name,
          performanceTotal: {
            total: 1337,
            totalYearAgo: 9001,
            totalYearAgoPercent: 404,
            contributionToVolume: 30,
            name: subAccount.name
          }
        };
    });

    return Observable.of(Object.assign({}, subAccountData, {
      entitiesPerformances: entitiesPerformancesMock
    }));
  }
}
