import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntityDTO } from '../../models/entity-dto.model';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../models/people-responsibilities-dto.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroupPerformanceTotal } from '../../models/role-groups.model';
import { RoleGroups } from '../../models/role-groups.model';
import { ViewType } from '../../enums/view-type.enum';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import * as ViewTypeActions from '../../state/actions/view-types.action';

interface ResponsibilitiesData {
  roleGroups?: RoleGroups;
  viewType?: ViewType;
  entityTypes?: Array<{ entityTypeName: string, entityTypeId: string }>;
  entitiesURL?: string;
  positionId?: string;
  filter?: MyPerformanceFilterState;
  performanceTotals?: Array<RoleGroupPerformanceTotal>;
}

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private myPerformanceApiService: MyPerformanceApiService,
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
      .switchMap((responsibilitiesData) => this.getPerformanceTotalForRoleGroups(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.getAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructSuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
  }

  @Effect({dispatch: false})
  fetchResponsibilitiesFailure$(): Observable<Action> {
    return this.actions$
    .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION)
    .do((action: Action) => {
      console.error('Responsibilities fetch failure:', action.payload);
    });
  }

  private getResponsibilities(responsibilitiesData: ResponsibilitiesData)
    : Observable<ResponsibilitiesData> {
      return this.myPerformanceApiService.getResponsibilities(responsibilitiesData.positionId)
      .map((response: PeopleResponsibilitiesDTO) => {
        let roleGroups: RoleGroups;
        let viewType: ViewType;
        let entityTypes: Array<{ entityTypeName: string, entityTypeId: string }>;
        let entitiesURL: string;

        if (response.positions) {
          viewType = ViewType.roleGroups;

          roleGroups = this.responsibilitiesTransformerService.groupPeopleByRoleGroups(response.positions);
          entityTypes = Object.keys(roleGroups).map((roleGroup: string) => {
            return {
              entityTypeName: roleGroup,
              entityTypeId: roleGroups[roleGroup][0].type
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
          roleGroups: roleGroups,
          viewType: viewType,
          entityTypes: entityTypes,
          entitiesURL: entitiesURL
        });
      });
    }

  // See if I can change this function to take an observable and return it if no treatment is necessary
  private getPerformanceTotalForRoleGroups(responsibilitiesData: ResponsibilitiesData)
    : Observable<ResponsibilitiesData> {
    if (responsibilitiesData.viewType === ViewType.roleGroups) {
      return this.myPerformanceApiService
      .getResponsibilitiesPerformanceTotals(responsibilitiesData.positionId,
        responsibilitiesData.entityTypes,
        responsibilitiesData.filter)
      .mergeMap((res: Array<RoleGroupPerformanceTotal>) => {
        responsibilitiesData.performanceTotals = res;
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
        return Observable.of(Object.assign(responsibilitiesData, {
          roleGroups: this.responsibilitiesTransformerService.groupsAccountsDistributors(accountsDistributors)
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
        responsibilities: responsibilitiesData.roleGroups,
        performanceTotals: responsibilitiesData.performanceTotals
      })
    ]);
  }
}
