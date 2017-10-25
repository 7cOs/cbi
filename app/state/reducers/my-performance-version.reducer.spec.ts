import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceStateMock, getMyPerformanceEntitiesDataMock } from './my-performance.state.mock';
import { initialState, MyPerformanceEntitiesData } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';

let chance = new Chance();

describe('My Performance Version Reducer', () => {

  it('should not modify the initial state when a save action is dispatched', () => {
    const savedObject = getMyPerformanceEntitiesDataMock();
    myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceState(savedObject));

    expect(initialState.versions.length).toBe(0);
  });

  it('should save the current state when a save action is dispatched', () => {
    const savedObject = getMyPerformanceEntitiesDataMock();
    const newState = myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceState(savedObject));

    expect(newState.current).toEqual(initialState.current);
    expect(newState.versions.length).toBe(1);
    expect(newState.versions[0]).toBe(savedObject);
  });

  it('should not modify the initial state when a restore action is dispatched', () => {
    const savedObject = getMyPerformanceEntitiesDataMock();
    initialState.versions.push(savedObject);
    myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceState());

    expect(initialState.versions.length).toBe(1);
  });

  it('should update the current state when a restore action is dispatched', () => {
    const savedObject: MyPerformanceEntitiesData = {
      responsibilities: {
        status: ActionStatus.Fetched,
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
      selectedEntityType: getEntityTypeMock()
    };

    initialState.versions.push(savedObject);
    const newState = myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceState());

    expect(newState.current).toEqual(savedObject);
  });

  it('should set the selected entity type when SetMyPerformanceSelectedEntityType is received', () => {
    const entityTypeMock = getEntityTypeMock();
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: beforeState.current.selectedBrandCode,
        selectedEntityType: entityTypeMock
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(entityTypeMock));
    expect(actualState).toEqual(expectedState);
  });

  it('should set the selected brand when SetMyPerformanceSelectedBrandCode is received', () => {
    const selectedBrandCodeMock = chance.string();
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        salesHierarchyViewType: beforeState.current.salesHierarchyViewType,
        selectedEntityDescription: beforeState.current.selectedEntityDescription,
        selectedBrandCode: selectedBrandCodeMock,
        selectedEntityType: beforeState.current.selectedEntityType
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(selectedBrandCodeMock));
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
