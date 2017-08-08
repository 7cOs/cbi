import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { myPerformanceReducer, initialState } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';

let chance = new Chance();

describe('My Performance Reducer', () => {

  it('should not modify the initial state when a save action is dispatched', () => {
    const savedObject = {'key': chance.string()};
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceStateAction(savedObject));

    expect(initialState.versions.length).toBe(0);
  });

  it('should save the current state when a save action is dispatched', () => {
    const savedObject = {'key': chance.string()};
    const newState = myPerformanceReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceStateAction(savedObject));

    expect(newState.current).toEqual(initialState.current);
    expect(newState.versions.length).toBe(1);
    expect(newState.versions[0]).toBe(savedObject);
  });

  it('should not modify the initial state when a restore action is dispatched', () => {
    const savedObject = {'key': chance.string()};
    initialState.versions.push(savedObject);
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());

    expect(initialState.versions.length).toBe(1);
  });

  it('should update the current state when a restore action is dispatched', () => {
    const savedObject = {
      responsibilities: {
        status: ActionStatus.Fetched,
        responsibilities: chance.string()
      }
    };

    initialState.versions.push(savedObject);
    const newState = myPerformanceReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());

    expect(newState.current).toEqual(savedObject);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
