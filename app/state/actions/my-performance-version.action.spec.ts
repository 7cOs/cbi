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
      expect(MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE).toBe('[My Performance] SAVE_MY_PERFORMANCE_STATE');
      expect(action.type).toBe(MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(myPerformanceDataMock);
    });
  });

  describe('RestoreMyPerformanceAction', () => {
    let action: MyPerformanceVersionActions.RestoreMyPerformanceStateAction;

    beforeEach(() => {
      action = new MyPerformanceVersionActions.RestoreMyPerformanceStateAction();
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE)
        .toBe('[My Performance] RESTORE_MY_PERFORMANCE_STATE');
      expect(action.type).toBe(MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE);
    });

    it('should have a default payload of 1 if none is provided', () => {
      expect(action.payload).toBe(1);
    });

    it('should contain the correct payload when one is provided', () => {
      const actionPayloadMock = chance.natural();
      const actionWithPayloadMock = new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(actionPayloadMock);
      expect(actionWithPayloadMock.payload).toEqual(actionPayloadMock);
    });
  });

  describe('SetMyPerformanceSelectedEntityAction', () => {
    let entityNameMock: string;
    let action: MyPerformanceVersionActions.SetMyPerformanceSelectedEntityAction;

    beforeEach(() => {
      entityNameMock = chance.string();
      action = new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityAction(entityNameMock);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY)
        .toBe('[My Performance] SET_MY_PERFORMANCE_SELECTED_ENTITY');
      expect(action.type).toBe(MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(entityNameMock);
    });
  });

  describe('ClearMyPerformanceAction', () => {
    let action: MyPerformanceVersionActions.ClearMyPerformanceStateAction;

    beforeEach(() => {
      action = new MyPerformanceVersionActions.ClearMyPerformanceStateAction();
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE)
        .toBe('[My Performance] CLEAR_MY_PERFORMANCE_STATE');
      expect(action.type).toBe(MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE);
    });
  });
});
