import * as Chance from 'chance';

import * as MyPerformanceVersionActions from './my-performance-version.action';

let chance = new Chance();

describe('Responsibilities Actions', () => {

  describe('SaveMyPerformanceStateAction', () => {
    let action: MyPerformanceVersionActions.SaveMyPerformanceStateAction;
    let myPerformanceDataMock: any;

    beforeEach(() => {
      myPerformanceDataMock = chance.string();
      action = new MyPerformanceVersionActions.SaveMyPerformanceStateAction(myPerformanceDataMock);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE_ACTION).toBe('[My Performance] SAVE_MY_PERFORMANCE_STATE_ACTION');
      expect(action.type).toBe(MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(myPerformanceDataMock);
    });
  });

  describe('FetchResponsibilitiesSuccessAction', () => {
    let action: MyPerformanceVersionActions.RestoreMyPerformanceStateAction;

    beforeEach(() => {
      action = new MyPerformanceVersionActions.RestoreMyPerformanceStateAction();
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION)
        .toBe('[My Performance] RESTORE_MY_PERFORMANCE_STATE_ACTION');
      expect(action.type).toBe(MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION);
    });
  });

});
