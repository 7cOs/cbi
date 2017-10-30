import { Action } from '@ngrx/store';
import * as Chance from 'chance';

import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceStateMock, getResponsibilitesStateMock } from './my-performance.state.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { myPerformanceReducer, MyPerformanceState } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import * as myPerformanceVersion from './my-performance-version.reducer';
import * as responsibilities from './responsibilities.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import * as SalesHierarchyViewTypeActions from '../actions/sales-hierarchy-view-type.action';
import * as salesHierarchyViewTypeReducer from './sales-hierarchy-view-type.reducer';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

const chance = new Chance();

describe('My Performance Reducer', () => {
  let inputMyPerformanceStateMock: MyPerformanceState;

  let myPerformanceStateMock: MyPerformanceState;
  let responsibilitiesStateMock: responsibilities.ResponsibilitiesState;
  let salesHierarchyViewTypeStateMock: salesHierarchyViewTypeReducer.SalesHierarchyViewTypeState;

  let myPerformanceVersionReducerSpy: jasmine.Spy;
  let responsibilitiesReducerSpy: jasmine.Spy;
  let salesHierarchyViewTypeReducerSpy: jasmine.Spy;

  beforeEach(() => {
    inputMyPerformanceStateMock = getMyPerformanceStateMock();

    myPerformanceStateMock = getMyPerformanceStateMock();
    responsibilitiesStateMock = getResponsibilitesStateMock();
    salesHierarchyViewTypeStateMock = {viewType: getSalesHierarchyViewTypeMock()};

    myPerformanceVersionReducerSpy = spyOn(myPerformanceVersion, 'myPerformanceVersionReducer')
      .and.returnValue(myPerformanceStateMock);
    responsibilitiesReducerSpy = spyOn(responsibilities, 'responsibilitiesReducer')
      .and.returnValue(responsibilitiesStateMock);
    salesHierarchyViewTypeReducerSpy = spyOn(salesHierarchyViewTypeReducer, 'salesHierarchyViewTypeReducer')
      .and.returnValue(salesHierarchyViewTypeStateMock);
  });

  it('should call the versioning reducer when a versioning action is received', () => {
    const actions: Action[] = [
      new MyPerformanceVersionActions.SaveMyPerformanceState(null),
      new MyPerformanceVersionActions.RestoreMyPerformanceState(),
      new MyPerformanceVersionActions.SetMyPerformanceSelectedEntity(chance.string()),
      new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(getEntityTypeMock()),
      new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(chance.string()),
      new MyPerformanceVersionActions.SetMyPerformanceSelectedSkuCode({
        skuPackageCode: chance.string(),
        skuPackageType: SkuPackageType.package
      }),
      new MyPerformanceVersionActions.ClearMyPerformanceState()
    ];

    const returnedStates: MyPerformanceState[] = actions.map((action: Action) => {
      return myPerformanceReducer(inputMyPerformanceStateMock, action);
    });

    expect(myPerformanceVersionReducerSpy).toHaveBeenCalledTimes(actions.length);
    actions.forEach((action: Action, index: number) => {
      expect(myPerformanceVersionReducerSpy.calls.argsFor(index)).toEqual([inputMyPerformanceStateMock, action]);
    });
    returnedStates.forEach((state: MyPerformanceState) => {
      expect(state).toEqual(myPerformanceStateMock);
    });

    expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
    expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
  });

  it('should call the responsibilities reducer and leave selectedEntityDescription unmodified ' +
  'for responsibilities actions with NO selectedEntityDescription in their payloads', () => {
    const actions: Action[] = [
      new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
        positionId: chance.string(),
        groupedEntities: {},
        hierarchyGroups: [],
        entityWithPerformance: []
      }),
      new ResponsibilitiesActions.FetchResponsibilitiesFailure(new Error()),
      new ResponsibilitiesActions.GetPeopleByRoleGroup(EntityPeopleType.CORPORATE),
      new ResponsibilitiesActions.FetchEntityWithPerformanceSuccess({
        entityWithPerformance: [],
        entityTypeCode: chance.string()
      }),
      new ResponsibilitiesActions.FetchTotalPerformance({
        positionId: chance.string(),
        filter: null
      }),
      new ResponsibilitiesActions.FetchTotalPerformanceSuccess(getPerformanceMock()),
      new ResponsibilitiesActions.FetchTotalPerformanceFailure(new Error()),
      new ResponsibilitiesActions.SetTotalPerformance(chance.string()),
      new ResponsibilitiesActions.SetTotalPerformanceForSelectedRoleGroup(chance.string()),
      new ResponsibilitiesActions.FetchSubAccountsSuccess({
        groupedEntities: null,
        entityWithPerformance: []
      }),
      new ResponsibilitiesActions.SetAlternateHierarchyId(chance.string())
    ];

    const returnedStates: MyPerformanceState[] = actions.map((action: Action) => {
      return myPerformanceReducer(inputMyPerformanceStateMock, action);
    });

    expect(responsibilitiesReducerSpy).toHaveBeenCalledTimes(actions.length);
    actions.forEach((action: Action, index: number) => {
      expect(responsibilitiesReducerSpy.calls.argsFor(index)).toEqual([inputMyPerformanceStateMock.current.responsibilities, action]);
    });
    returnedStates.forEach((state: MyPerformanceState) => {
      expect(state).toEqual({
        current: {
          responsibilities: responsibilitiesStateMock,
          salesHierarchyViewType: inputMyPerformanceStateMock.current.salesHierarchyViewType,
          selectedEntityDescription: inputMyPerformanceStateMock.current.selectedEntityDescription,
          selectedEntityType: inputMyPerformanceStateMock.current.selectedEntityType,
          selectedBrandCode: inputMyPerformanceStateMock.current.selectedBrandCode,
          selectedSkuPackageCode: inputMyPerformanceStateMock.current.selectedSkuPackageCode
        },
        versions: inputMyPerformanceStateMock.versions
      });
    });

    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
    expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
  });

  it('should call the responsibilities reducer and modify selectedEntityDescription ' +
  'for responsibilities actions with selectedEntityDescription in their payloads', () => {
    const selectedEntityDescriptionMock = chance.string();

    const actions: Action[] = [
      new ResponsibilitiesActions.FetchResponsibilities({
        positionId: chance.string(),
        filter: null,
        selectedEntityDescription: selectedEntityDescriptionMock
      }),
      new ResponsibilitiesActions.FetchEntityWithPerformance({
        entityTypeGroupName: EntityPeopleType.CORPORATE,
        entityTypeCode: chance.string(),
        entities: [],
        filter: null,
        positionId: chance.string(),
        entityType: EntityType.RoleGroup,
        selectedEntityDescription: selectedEntityDescriptionMock
      }),
      new ResponsibilitiesActions.FetchSubAccounts({
        positionId: chance.string(),
        contextPositionId: chance.string(),
        entityTypeAccountName: chance.string(),
        selectedPositionId: chance.string(),
        filter: null,
        selectedEntityDescription: selectedEntityDescriptionMock
      }),
      new ResponsibilitiesActions.FetchAlternateHierarchyResponsibilities({
        positionId: chance.string(),
        alternateHierarchyId: chance.string(),
        filter: null,
        selectedEntityDescription: selectedEntityDescriptionMock
      })
    ];

    const returnedStates: MyPerformanceState[] = actions.map((action: Action) => {
      return myPerformanceReducer(inputMyPerformanceStateMock, action);
    });

    expect(responsibilitiesReducerSpy).toHaveBeenCalledTimes(actions.length);
    actions.forEach((action: Action, index: number) => {
      expect(responsibilitiesReducerSpy.calls.argsFor(index)).toEqual([inputMyPerformanceStateMock.current.responsibilities, action]);
    });
    returnedStates.forEach((state: MyPerformanceState) => {
      expect(state).toEqual({
        current: {
          responsibilities: responsibilitiesStateMock,
          salesHierarchyViewType: inputMyPerformanceStateMock.current.salesHierarchyViewType,
          selectedEntityDescription: selectedEntityDescriptionMock,
          selectedEntityType: inputMyPerformanceStateMock.current.selectedEntityType,
          selectedBrandCode: inputMyPerformanceStateMock.current.selectedBrandCode,
          selectedSkuPackageCode: inputMyPerformanceStateMock.current.selectedSkuPackageCode
        },
        versions: inputMyPerformanceStateMock.versions
      });
    });

    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
    expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
  });

  it('should call the salesHierarchyViewType reducer when a salesHierarchyViewType action is received', () => {
    const action: Action = new SalesHierarchyViewTypeActions.SetSalesHierarchyViewType(
      SalesHierarchyViewType[getSalesHierarchyViewTypeMock()]
    );
    const returnedState: MyPerformanceState = myPerformanceReducer(inputMyPerformanceStateMock, action);

    expect(salesHierarchyViewTypeReducerSpy).toHaveBeenCalledTimes(1);
    expect(salesHierarchyViewTypeReducerSpy.calls.argsFor(0)).toEqual([inputMyPerformanceStateMock.current.salesHierarchyViewType, action]);
    expect(returnedState).toEqual({
      current: {
        responsibilities: inputMyPerformanceStateMock.current.responsibilities,
        salesHierarchyViewType: salesHierarchyViewTypeStateMock,
        selectedEntityDescription: inputMyPerformanceStateMock.current.selectedEntityDescription,
        selectedEntityType: inputMyPerformanceStateMock.current.selectedEntityType,
        selectedBrandCode: inputMyPerformanceStateMock.current.selectedBrandCode,
        selectedSkuPackageCode: inputMyPerformanceStateMock.current.selectedSkuPackageCode
      },
      versions: inputMyPerformanceStateMock.versions
    });

    expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceReducer(
      inputMyPerformanceStateMock,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(inputMyPerformanceStateMock);
  });
});
