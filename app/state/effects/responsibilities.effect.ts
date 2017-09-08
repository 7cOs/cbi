import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import * as Chance from 'chance';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntityDTO } from '../../models/entity-dto.model';
import { EntityResponsibilities } from '../../models/entity-responsibilities.model';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../models/people-responsibilities-dto.model';
import { EntitiesTotalPerformancesDTO } from '../../models/entities-total-performances.model';
import { PerformanceTransformerService } from '../../services/performance-transformer.service';
import { EntitiesPerformances, EntitiesPerformancesDTO } from '../../models/entities-performances.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { ViewType } from '../../enums/view-type.enum';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import * as ViewTypeActions from '../../state/actions/view-types.action';

const chance = new Chance();

interface ResponsibilitiesData {
  groupedEntities?: GroupedEntities;
  viewType?: ViewType;
  entityTypes?: Array<{ type: string, name: string }>;
  entitiesURL?: string;
  positionId?: string;
  filter?: MyPerformanceFilterState;
  entitiesPerformances?: Array<EntitiesPerformances>;
}

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private myPerformanceApiService: MyPerformanceApiService,
    private performanceTransformerService: PerformanceTransformerService,
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService
  ) { }

  @Effect()
  fetchResponsibilities$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION)
      .switchMap((action: Action) => {
        const responsibilitiesData: ResponsibilitiesData = {
          filter: action.payload.filter,
          positionId: action.payload.positionId
        };

        return Observable.of(responsibilitiesData);
      })
      .switchMap((responsibilitiesData) => this.getResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.getPerformanceTotalForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.getAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructSuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
  }

  @Effect() FetchResponsibilityEntityPerformance$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE)
      .switchMap((action: Action) => {
        const { entityType, entities, filter, entitiesTotalPerformances, viewType } = action.payload;

        return this.myPerformanceApiService.getResponsibilitiesPerformanceTotals(entities, filter)
          .switchMap((response: EntitiesPerformancesDTO[]) => {
            const entityPerformance = this.performanceTransformerService.transformEntitiesPerformancesDTO(response);

            return Observable.from([
              new ResponsibilitiesActions.SetTableRowPerformanceTotal(entitiesTotalPerformances),
              new ResponsibilitiesActions.GetPeopleByRoleGroupAction(entityType),
              new ResponsibilitiesActions.FetchResponsibilityEntityPerformanceSuccess(entityPerformance),
              new ViewTypeActions.SetLeftMyPerformanceTableViewType(viewType)
            ]);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
    });
  }

  @Effect({dispatch: false})
  fetchResponsibilitiesFailure$(): Observable<Action> {
    return this.actions$
    .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION)
    .do((action: Action) => {
      console.error('Responsibilities fetch failure:', action.payload);
    });
  }

  @Effect()
  fetchPerformanceTotal$(): Observable<Action> {
    return this.actions$
      .ofType(
        ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_ACTION,
        ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION
      )
      .switchMap((action: Action) => {
        const { positionId, filter } = action.payload;

        return this.myPerformanceApiService.getPerformanceTotal(positionId, filter)
          .map((response: EntitiesTotalPerformancesDTO) => {
            const performanceTotal = this.performanceTransformerService.transformEntitiesTotalPerformancesDTO(response);
            return new ResponsibilitiesActions.FetchPerformanceTotalSuccessAction(performanceTotal);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchPerformanceTotalFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchPerformanceTotalFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION)
      .do(action => {
        console.error('Failed fetching performance total data', action.payload);
      });
  }

  private getResponsibilities(responsibilitiesData: ResponsibilitiesData)
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

  private getPerformanceTotalForGroupedEntities(responsibilitiesData: ResponsibilitiesData)
    : Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.roleGroups) {
      return this.myPerformanceApiService
      .getResponsibilitiesPerformanceTotals(responsibilitiesData.entityTypes,
        responsibilitiesData.filter,
        responsibilitiesData.positionId)
      .mergeMap((response: EntitiesPerformancesDTO[]) => {
        responsibilitiesData.entitiesPerformances
          = this.performanceTransformerService.transformEntitiesPerformancesDTO(response);
        return Observable.of(responsibilitiesData);
      });
    } else {
      return Observable.of(responsibilitiesData);
    }
  }

  private getAccountsDistributors(responsibilitiesData: ResponsibilitiesData)
    : Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.distributors
      || responsibilitiesData.viewType === ViewType.accounts) {
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

  private constructSuccessAction(responsibilitiesData: ResponsibilitiesData)
    : Observable<Action> {
    return Observable.from([
      new ViewTypeActions.SetLeftMyPerformanceTableViewType(responsibilitiesData.viewType),
      new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction({
        positionId: responsibilitiesData.positionId,
        groupedEntities: responsibilitiesData.groupedEntities,
        entitiesPerformances: responsibilitiesData.entitiesPerformances
      })
    ]);
  }
}
