import * as DateRangesActions from './date-ranges.action';
import { DateRange } from '../../models/date-range.model';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import * as Chance from 'chance';
let chance = new Chance();

describe('Date Ranges Actions', () => {

  describe('FetchDateRangesAction', () => {
    let action: DateRangesActions.FetchDateRangesAction;

    beforeEach(() => {
      action = new DateRangesActions.FetchDateRangesAction();
    });

    it('should have the correct type', () => {
      expect(DateRangesActions.FETCH_DATE_RANGES_ACTION).toBe('[Date Ranges] FETCH_DATE_RANGES_ACTION');
      expect(action.type).toBe(DateRangesActions.FETCH_DATE_RANGES_ACTION);
    });
  });

  describe('FetchVersionSuccessAction', () => {
    const dateRange1: DateRange = getDateRangeMock();
    const dateRange2: DateRange = getDateRangeMock();
    const dateRangesMock: DateRange[] = [dateRange1, dateRange2];
    let action: DateRangesActions.FetchDateRangesSuccessAction;

    beforeEach(() => {
      action = new DateRangesActions.FetchDateRangesSuccessAction(dateRangesMock);
    });

    it('should have the correct type', () => {
      expect(DateRangesActions.FETCH_DATE_RANGES_SUCCESS_ACTION).toBe('[Date Ranges] FETCH_DATE_RANGES_SUCCESS_ACTION');
      expect(action.type).toBe(DateRangesActions.FETCH_DATE_RANGES_SUCCESS_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(dateRangesMock);
    });
  });

  describe('FetchVersionFailureAction', () => {
    const error: Error = new Error(chance.string());
    let action: DateRangesActions.FetchDateRangesFailureAction;

    beforeEach(() => {
      action = new DateRangesActions.FetchDateRangesFailureAction(error);
    });

    it('should have the correct type', () => {
      expect(DateRangesActions.FETCH_DATE_RANGES_FAILURE_ACTION).toBe('[Date Ranges] FETCH_DATE_RANGES_FAILURE_ACTION');
      expect(action.type).toBe(DateRangesActions.FETCH_DATE_RANGES_FAILURE_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });
});
