import * as Chance from 'chance';

import { PerformanceTotal } from '../../models/performance-total.model';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import * as PerformanceTotalActions from './performance-total.action';

const chance = new Chance();

describe('Performance Total Actions', () => {

  describe('Fetch Performance Total Action', () => {
    const mockPositionId: number = chance.integer();
    let action: PerformanceTotalActions.FetchPerformanceTotalAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalAction(mockPositionId);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION).toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toBe(mockPositionId);
    });
  });

  describe('Fetch Performance Total Success Action', () => {
    const mockPerformanceTotal: PerformanceTotal = getPerformanceTotalMock();
    let action: PerformanceTotalActions.FetchPerformanceTotalSuccessAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(mockPerformanceTotal);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(mockPerformanceTotal);
    });
  });

  describe('Fetch Performance Total Failure Action', () => {
    const mockError: Error = new Error(chance.string());
    let action: PerformanceTotalActions.FetchPerformanceTotalFailureAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalFailureAction(mockError);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toBe(mockError);
    });
  });
});
