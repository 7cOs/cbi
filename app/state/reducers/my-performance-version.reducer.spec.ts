import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceStateMock, getMyPerformanceEntitiesDataMock } from './my-performance.state.mock';
import { initialState, MyPerformanceEntitiesData, MyPerformanceState } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';
import { SkuPackageType  } from '../../enums/sku-package-type.enum';
import { SkuPackagePayload } from '../actions/my-performance-version.action';

const chance = new Chance();

describe('My Performance Version Reducer', () => {

  it('should not modify the initial state when a save action is dispatched', () => {
    const savedObject: MyPerformanceEntitiesData = getMyPerformanceEntitiesDataMock();
    myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceState(savedObject));

    expect(initialState.versions.length).toBe(0);
  });

  it('should save the current state when a save action is dispatched', () => {
    const savedObject: MyPerformanceEntitiesData = getMyPerformanceEntitiesDataMock();
    const newState: MyPerformanceState = myPerformanceVersionReducer(
      initialState,
      new MyPerformanceVersionActions.SaveMyPerformanceState(savedObject));

    expect(newState.current).toEqual(initialState.current);
    expect(newState.versions.length).toBe(1);
    expect(newState.versions[0]).toBe(savedObject);
  });

  it('should not modify the initial state when a restore action is dispatched', () => {
    const savedObject: MyPerformanceEntitiesData = getMyPerformanceEntitiesDataMock();
    initialState.versions.push(savedObject);
    myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceState());

    expect(initialState.versions.length).toBe(1);
  });

  it('should update the current state when a restore action is dispatched', () => {
    const savedObject: MyPerformanceEntitiesData = {
      responsibilities: {
        status: ActionStatus.Fetched,
        responsibilitiesStatus: ActionStatus.Fetched,
        entitiesPerformanceStatus: ActionStatus.Fetched,
        totalPerformanceStatus: ActionStatus.Fetched,
        subaccountsStatus: ActionStatus.Fetched,
        positionId: chance.string(),
        groupedEntities: chance.string() as any,
        hierarchyGroups: chance.string() as any,
        entityWithPerformance: [] as any,
        entitiesTotalPerformances: {
          total: 0,
          totalYearAgo: 0,
          totalYearAgoPercent: 0,
          contributionToVolume: 0,
          error: false
        }
      },
      selectedEntityDescription: chance.string(),
      selectedEntityType: getEntityTypeMock(),
      filter: getMyPerformanceFilterMock()
    };

    initialState.versions.push(savedObject);
    const newState: MyPerformanceState = myPerformanceVersionReducer(
      initialState,
      new MyPerformanceVersionActions.RestoreMyPerformanceState());

    expect(newState.current).toEqual(savedObject);
  });

  it('should set the selected entity type when SetMyPerformanceSelectedEntityType is received', () => {
    const entityTypeMock: EntityType = getEntityTypeMock();
    const beforeState: MyPerformanceState = getMyPerformanceStateMock();
    const expectedState: MyPerformanceState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: beforeState.current.selectedBrandCode,
        selectedSkuPackageCode: beforeState.current.selectedSkuPackageCode,
        selectedEntityType: entityTypeMock,
        filter: beforeState.current.filter
      },
      versions: beforeState.versions
    };
    const actualState: MyPerformanceState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(entityTypeMock));
    expect(actualState).toEqual(expectedState);
  });

  it('should set the selected brand when SetMyPerformanceSelectedBrandCode is received', () => {
    const selectedBrandCodeMock: string = chance.string();
    const beforeState: MyPerformanceState = getMyPerformanceStateMock();
    const expectedState: MyPerformanceState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: selectedBrandCodeMock,
        selectedEntityType: beforeState.current.selectedEntityType,
        filter: beforeState.current.filter
      },
      versions: beforeState.versions
    };
    const actualState: MyPerformanceState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(selectedBrandCodeMock));
    expect(actualState).toEqual(expectedState);
  });

  it('should set the selected sku when SetMyPerformanceSelectedSkuCode is received', () => {
    const skuPackagePayload: SkuPackagePayload = {
      skuPackageCode: chance.string(),
      skuPackageType: SkuPackageType.sku
    };
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: beforeState.current.selectedBrandCode,
        selectedSkuPackageCode: skuPackagePayload.skuPackageCode,
        selectedSkuPackageType: skuPackagePayload.skuPackageType,
        selectedEntityType: beforeState.current.selectedEntityType,
        filter: beforeState.current.filter
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.SetMyPerformanceSelectedSkuCode(skuPackagePayload));
    expect(actualState).toEqual(expectedState);
  });

  it('should clear the selected sku when ClearMyPerformanceSelectedSkuCode is received', () => {
    const clearedSkuPackageCode: string = null;
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: beforeState.current.selectedBrandCode,
        selectedSkuPackageCode: clearedSkuPackageCode,
        selectedEntityType: beforeState.current.selectedEntityType,
        filter: beforeState.current.filter
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
    expect(actualState).toEqual(expectedState);
  });

  it('should clear the selected brand when ClearMyPerformanceSelectedBrandCode is received', () => {
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedEntityType: beforeState.current.selectedEntityType,
        filter: beforeState.current.filter
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.ClearMyPerformanceSelectedBrandCode());
    expect(actualState).toEqual(expectedState);
  });

  it('should set the selected subaccount code when SetMyPerformanceSelectedSubaccountCode is received', () => {
    const payload = chance.string();
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: beforeState.current.selectedBrandCode,
        selectedSkuPackageCode: beforeState.current.selectedSkuPackageCode,
        selectedSkuPackageType: beforeState.current.selectedSkuPackageType,
        selectedEntityType: beforeState.current.selectedEntityType,
        selectedSubaccountCode: payload,
        filter: beforeState.current.filter
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.SetMyPerformanceSelectedSubaccountCode(payload));
    expect(actualState).toEqual(expectedState);
  });

  it('should clear the selected subaccount when ClearMyPerformanceSelectedSubaccountCode is received', () => {
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: beforeState.current.selectedBrandCode,
        selectedSkuPackageCode: beforeState.current.selectedSkuPackageCode,
        selectedSkuPackageType: beforeState.current.selectedSkuPackageType,
        selectedEntityType: beforeState.current.selectedEntityType,
        filter: beforeState.current.filter
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.ClearMyPerformanceSelectedSubaccountCode());
    expect(actualState).toEqual(expectedState);
  });

  it('should return the MyPerformanceState to its initial state when ClearMyPerformanceState is received', () => {
    expect(myPerformanceVersionReducer(getMyPerformanceStateMock(), new MyPerformanceVersionActions.ClearMyPerformanceState()))
      .toEqual(initialState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceVersionReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
