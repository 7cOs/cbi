import * as Chance from 'chance';

import { myPerformanceBreadcrumbReducer, initialState } from './my-performance-breadcrumb.reducer';
import * as BreadcrumbActions from '../actions/my-performance-breadcrumb.action';

let chance = new Chance();

describe('My Performance Breadcrumb Reducer', () => {
  let entityMock: string;

  beforeEach(() => {
    entityMock = chance.string();
  });

  it('should update the trail with the payload when a AddBreadcrumbEntity is dispatched when current trail is empty', () => {
    const expectedState = {
      trail: [ entityMock ]
    };

    const actualState = myPerformanceBreadcrumbReducer(initialState, new BreadcrumbActions.AddBreadcrumbEntity(entityMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the trail with the payload when a AddBreadcrumbEntity is dispatched when current trail is not empty', () => {
    const beforeState = {
      trail: [ entityMock ]
    };

    const expectedState = {
      trail: [ entityMock, entityMock ]
    };

    const actualState = myPerformanceBreadcrumbReducer(beforeState, new BreadcrumbActions.AddBreadcrumbEntity(entityMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should remove specified number of entities in payload when RemoveBreadcrumbEntities is dispatched ', () => {
    const beforeState = {
      trail: [ entityMock, entityMock, entityMock, entityMock ]
    };

    const expectedState = {
      trail: [ entityMock, entityMock ]
    };

    const actualState = myPerformanceBreadcrumbReducer(beforeState, new BreadcrumbActions.RemoveBreadcrumbEntities(2));

    expect(actualState).toEqual(expectedState);
  });

  it('should reset to initial state when ResetBreadcrumbTrail is dispatched', () => {
    const beforeState = {
      trail: [ entityMock, entityMock, entityMock, entityMock ]
    };

    const actualState = myPerformanceBreadcrumbReducer(beforeState, new BreadcrumbActions.ResetBreadcrumbTrail());

    expect(actualState).toEqual(initialState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(myPerformanceBreadcrumbReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
