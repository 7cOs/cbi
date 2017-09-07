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
    responsibilitiesReducerSpy = spyOn(responsibilities, 'responsibilitiesReducer').and.callThrough();
  });

  it('should call the versioning reducer when a versioning action is received', () => {
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceStateAction(null));
    myPerformanceReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());

    expect(myPerformanceVersionReducerSpy).toHaveBeenCalled();
    expect(myPerformanceVersionReducerSpy.calls.count()).toBe(2);
    expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
  });

  it('should call the responsibilities reducer when a responsibility action is received', () => {
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesAction({
      positionId: chance.string(),
      filter: null
    }));
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction({
      positionId: chance.string(),
      groupedEntities: {},
      entitiesPerformances: []
    }));
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(new Error()));

    expect(responsibilitiesReducerSpy).toHaveBeenCalled();
    expect(responsibilitiesReducerSpy.calls.count()).toBe(3);
    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
