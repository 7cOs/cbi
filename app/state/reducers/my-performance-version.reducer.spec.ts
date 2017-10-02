import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { getMyPerformanceStateMock, getMyPerformanceEntitiesDataMock } from './my-performance.state.mock';
import { initialState } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';

let chance = new Chance();

describe('My Performance Version Reducer', () => {

  it('should not modify the initial state when a save action is dispatched', () => {
    const savedObject = getMyPerformanceEntitiesDataMock();
    myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceStateAction(savedObject));

    expect(initialState.versions.length).toBe(0);
  });

  it('should save the current state when a save action is dispatched', () => {
    const savedObject = getMyPerformanceEntitiesDataMock();
    const newState = myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceStateAction(savedObject));

    expect(newState.current).toEqual(initialState.current);
    expect(newState.versions.length).toBe(1);
    expect(newState.versions[0]).toBe(savedObject);
  });

  it('should not modify the initial state when a restore action is dispatched', () => {
    const savedObject = getMyPerformanceEntitiesDataMock();
    initialState.versions.push(savedObject);
    myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());

    expect(initialState.versions.length).toBe(1);
  });

  it('should update the current state when a restore action is dispatched', () => {
    const savedObject = {
      responsibilities: {
        status: ActionStatus.Fetched,
        positionId: chance.string(),
        groupedEntities: chance.string() as any,
        entityWithPerformance: [] as any,
        entitiesTotalPerformances: {
          total: 0,
          totalYearAgo: 0,
          totalYearAgoPercent: 0,
          contributionToVolume: 0,
          error: false
        }
      }
    };

    initialState.versions.push(savedObject);
    const newState = myPerformanceVersionReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());

    expect(newState.current).toEqual(savedObject);
  });

  it('should set the selected entity when SetMyPerformanceSelectedEntityAction is received', () => {
    const entityNameMock = chance.string();
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        responsibilities: beforeState.current.responsibilities,
        viewType: beforeState.current.viewType,
        selectedEntity: entityNameMock
      },
      versions: beforeState.versions
    };
    const actualState =
      myPerformanceVersionReducer(beforeState, new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityAction(entityNameMock));
    expect(actualState).toEqual(expectedState);
  });

  it('should return the MyPerformanceState to its initial state when ClearMyPerformanceStateAction is received', () => {

    expect(myPerformanceVersionReducer(getMyPerformanceStateMock(), new MyPerformanceVersionActions.ClearMyPerformanceStateAction()))
      .toEqual(initialState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceVersionReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
