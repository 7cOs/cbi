
import * as Chance from 'chance';

import * as MyPerformanceActions from './my-performance.action';

let chance = new Chance();

describe('My Performance Actions', () => {

  describe('SetMyPerformanceSelectedEntityAction', () => {
    let entityNameMock: string;
    let action: MyPerformanceActions.SetMyPerformanceSelectedEntityAction;

    beforeEach(() => {
      entityNameMock = chance.string();
      action = new MyPerformanceActions.SetMyPerformanceSelectedEntityAction(entityNameMock);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION)
        .toBe('[My Performance] SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION');
      expect(action.type).toBe(MyPerformanceActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(entityNameMock);
    });
  });

  describe('ClearMyPerformanceAction', () => {
    let action: MyPerformanceActions.ClearMyPerformanceStateAction;

    beforeEach(() => {
      action = new MyPerformanceActions.ClearMyPerformanceStateAction();
    });

    it('should have the correct type', () => {
      expect(MyPerformanceActions.CLEAR_MY_PERFORMANCE_STATE_ACTION)
        .toBe('[My Performance] CLEAR_MY_PERFORMANCE_STATE_ACTION');
      expect(action.type).toBe(MyPerformanceActions.CLEAR_MY_PERFORMANCE_STATE_ACTION);
    });
  });

});
