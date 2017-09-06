import * as Chance from 'chance';

import { getMyPerformanceStateMock } from './my-performance.state.mock';
import * as MyPerformanceActions from '../actions/my-performance.action';
import { myPerformanceReducer, MyPerformanceState, initialState } from './my-performance.reducer';
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
      positionId: chance.integer(),
      filter: null
    }));
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction({
      positionId: chance.integer(),
      responsibilities: {},
      performanceTotals: []
    }));
    myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(new Error()));

    expect(responsibilitiesReducerSpy).toHaveBeenCalled();
    expect(responsibilitiesReducerSpy.calls.count()).toBe(3);
    expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
  });

  it('should set the selected entity when SetMyPerformanceSelectedEntityAction is received', () => {
    const entityNameMock = chance.string();
    const beforeState = getMyPerformanceStateMock();
    const expectedState = {
      current: {
        performanceTotal: beforeState.current.performanceTotal,
        responsibilities: beforeState.current.responsibilities,
        viewType: beforeState.current.viewType,
        selectedEntity: entityNameMock
      },
      versions: beforeState.versions
    };
    const actualState = myPerformanceReducer(beforeState, new MyPerformanceActions.SetMyPerformanceSelectedEntityAction(entityNameMock));
    expect(actualState).toEqual(expectedState);
  });

  it('should return the MyPerformanceState to its initial state when ClearMyPerformanceStateAction is received', () => {

    expect(myPerformanceReducer(getMyPerformanceStateMock(), new MyPerformanceActions.ClearMyPerformanceStateAction()))
      .toEqual(initialState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
