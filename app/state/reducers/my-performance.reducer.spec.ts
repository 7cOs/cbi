import * as Chance from 'chance';

import { myPerformanceReducer, initialState } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import * as myPerformanceVersion from './my-performance-version.reducer';
import * as responsibilities from './responsibilities.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

let chance = new Chance();

describe('My Performance Reducer', () => {

  let myPerformanceVersionReducerSpy: jasmine.Spy;
  let responsibilitiesReducerSpy: jasmine.Spy;

  beforeEach(() => {
    myPerformanceVersionReducerSpy = spyOn(myPerformanceVersion, 'myPerformanceVersionReducer').and.callThrough();
    responsibilitiesReducerSpy = spyOn(responsibilities, 'responsibilitiesReducer').and.callFake(() => {});
  });

  it('should call the versioning reducer when a versioning action is received', () => {
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceState(null));
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceState());
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.SetMyPerformanceSelectedEntity(chance.string()));
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.ClearMyPerformanceState);

    expect(myPerformanceVersionReducerSpy).toHaveBeenCalledTimes(4);
    expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
  });

  it('should call the responsibilities reducer when a responsibility action is received', () => {
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilities({
      positionId: chance.string(),
      filter: null
    }));
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
      positionId: chance.string(),
      groupedEntities: {},
      hierarchyGroups: [],
      entityWithPerformance: []
    }));
    myPerformanceReducer(
      initialState,
      new ResponsibilitiesActions.SetTotalPerformance(chance.string())
    );
    myPerformanceReducer(
      initialState,
      new ResponsibilitiesActions.SetTotalPerformanceForSelectedRoleGroup(chance.string())
    );
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesFailure(new Error()));

    expect(responsibilitiesReducerSpy).toHaveBeenCalled();
    expect(responsibilitiesReducerSpy.calls.count()).toBe(5);
    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
