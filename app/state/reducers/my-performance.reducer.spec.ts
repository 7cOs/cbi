import { Action } from '@ngrx/store';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { getHierarchyGroupMock } from '../../models/hierarchy-group.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceStateMock, getResponsibilitesStateMock } from './my-performance.state.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { initialState, myPerformanceReducer, MyPerformanceState } from './my-performance.reducer';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';
import * as MyPerformanceFilterReducer from './my-performance-filter.reducer';
import { MyPerformanceFilterState } from './my-performance-filter.reducer';
import * as myPerformanceVersion from './my-performance-version.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as responsibilities from './responsibilities.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import * as SalesHierarchyViewTypeActions from '../actions/sales-hierarchy-view-type.action';
import * as salesHierarchyViewTypeReducer from './sales-hierarchy-view-type.reducer';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

const chance = new Chance();

describe('My Performance Reducer', () => {
  let inputMyPerformanceStateMock: MyPerformanceState;
  let myPerformanceFilterStateMock: MyPerformanceFilterState;

  let myPerformanceStateMock: MyPerformanceState;
  let responsibilitiesStateMock: responsibilities.ResponsibilitiesState;
  let salesHierarchyViewTypeStateMock: salesHierarchyViewTypeReducer.SalesHierarchyViewTypeState;

  let myPerformanceVersionReducerSpy: jasmine.Spy;
  let responsibilitiesReducerSpy: jasmine.Spy;
  let salesHierarchyViewTypeReducerSpy: jasmine.Spy;
  let myPerformanceFilterReducerSpy: jasmine.Spy;

  beforeEach(() => {
    inputMyPerformanceStateMock = getMyPerformanceStateMock();
    myPerformanceFilterStateMock = getMyPerformanceFilterMock();

    myPerformanceStateMock = getMyPerformanceStateMock();
    responsibilitiesStateMock = getResponsibilitesStateMock();
    salesHierarchyViewTypeStateMock = {viewType: getSalesHierarchyViewTypeMock()};

    myPerformanceVersionReducerSpy = spyOn(myPerformanceVersion, 'myPerformanceVersionReducer').and.returnValue(myPerformanceStateMock);
    responsibilitiesReducerSpy = spyOn(responsibilities, 'responsibilitiesReducer').and.returnValue(responsibilitiesStateMock);
    salesHierarchyViewTypeReducerSpy = spyOn(salesHierarchyViewTypeReducer, 'salesHierarchyViewTypeReducer')
      .and.returnValue(salesHierarchyViewTypeStateMock);
    myPerformanceFilterReducerSpy = spyOn(MyPerformanceFilterReducer, 'myPerformanceFilterReducer')
      .and.returnValue(myPerformanceFilterStateMock);
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
    expect(myPerformanceFilterReducerSpy).not.toHaveBeenCalled();
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
      new ResponsibilitiesActions.SetAlternateHierarchyId(chance.string()),
      new ResponsibilitiesActions.SetAccountPositionId(chance.string()),
      new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: chance.string(),
        groupedEntities: getGroupedEntitiesMock(),
        hierarchyGroups: [getHierarchyGroupMock()],
        selectedEntityType: getEntityTypeMock(),
        selectedEntityTypeCode: chance.string(),
        salesHierarchyViewType: getSalesHierarchyViewTypeMock(),
        filter: null,
        brandSkuCode: chance.string(),
        entityType: getEntityTypeMock(),
        alternateHierarchyId: chance.string(),
        accountPositionId: chance.string()
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
          selectedEntityDescription: inputMyPerformanceStateMock.current.selectedEntityDescription,
          selectedEntityType: inputMyPerformanceStateMock.current.selectedEntityType,
          selectedBrandCode: inputMyPerformanceStateMock.current.selectedBrandCode,
          selectedSkuPackageCode: inputMyPerformanceStateMock.current.selectedSkuPackageCode,
          filter: inputMyPerformanceStateMock.current.filter
        },
        versions: inputMyPerformanceStateMock.versions
      });
    });

    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
    expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
    expect(myPerformanceFilterReducerSpy).not.toHaveBeenCalled();
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
          selectedSkuPackageCode: inputMyPerformanceStateMock.current.selectedSkuPackageCode,
          filter: inputMyPerformanceStateMock.current.filter
        },
        versions: inputMyPerformanceStateMock.versions
      });
    });

    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
    expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
    expect(myPerformanceFilterReducerSpy).not.toHaveBeenCalled();
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
        selectedSkuPackageCode: inputMyPerformanceStateMock.current.selectedSkuPackageCode,
        filter: inputMyPerformanceStateMock.current.filter
      },
      versions: inputMyPerformanceStateMock.versions
    });

    expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
    expect(myPerformanceFilterReducerSpy).not.toHaveBeenCalled();
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceReducer(
      inputMyPerformanceStateMock,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(inputMyPerformanceStateMock);
  });

  describe('when a my performance filter action is received', () => {
    it('should call the MyPerformanceFilter reducer', () => {
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetMetric(MetricTypeValue.volume));
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetTimePeriod(DateRangeTimePeriodValue.FYTDBDL));
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.Off));
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.effective));

      expect(myPerformanceFilterReducerSpy).toHaveBeenCalled();
      expect(myPerformanceFilterReducerSpy.calls.count()).toBe(4);

      expect(myPerformanceFilterReducerSpy.calls.argsFor(0)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetMetric(MetricTypeValue.volume)]);
      expect(myPerformanceFilterReducerSpy.calls.argsFor(1)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetTimePeriod(DateRangeTimePeriodValue.FYTDBDL)]);
      expect(myPerformanceFilterReducerSpy.calls.argsFor(2)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.Off)]);
      expect(myPerformanceFilterReducerSpy.calls.argsFor(3)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.effective)]);

      expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
      expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
      expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
    });

    it('should update current.filter of MyPerformanceState', () => {
      const actualState: MyPerformanceState = myPerformanceReducer(
        initialState,
        new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.effective));

      const expectedState: MyPerformanceState = {
        current: {
          responsibilities: initialState.current.responsibilities,
          salesHierarchyViewType: initialState.current.salesHierarchyViewType,
          selectedEntityDescription: initialState.current.selectedEntityDescription,
          selectedEntityType: initialState.current.selectedEntityType,
          filter: myPerformanceFilterStateMock
        },
        versions: initialState.versions
      };

      expect(actualState).toEqual(expectedState);
    });
  });
});
