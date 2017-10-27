import * as Chance from 'chance';

import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import * as MyPerformanceVersionActions from './my-performance-version.action';

const chance = new Chance();

describe('My Performance Version Actions', () => {

  describe('SaveMyPerformanceState', () => {
    let action: MyPerformanceVersionActions.SaveMyPerformanceState;
    let myPerformanceDataMock: any;

    beforeEach(() => {
      myPerformanceDataMock = chance.string();
      action = new MyPerformanceVersionActions.SaveMyPerformanceState(myPerformanceDataMock);
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
    let action: MyPerformanceVersionActions.RestoreMyPerformanceState;

    beforeEach(() => {
      action = new MyPerformanceVersionActions.RestoreMyPerformanceState();
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
      const actionWithPayloadMock = new MyPerformanceVersionActions.RestoreMyPerformanceState(actionPayloadMock);
      expect(actionWithPayloadMock.payload).toEqual(actionPayloadMock);
    });
  });

  describe('SetMyPerformanceSelectedEntity', () => {
    let entityNameMock: string;
    let action: MyPerformanceVersionActions.SetMyPerformanceSelectedEntity;

    beforeEach(() => {
      entityNameMock = chance.string();
      action = new MyPerformanceVersionActions.SetMyPerformanceSelectedEntity(entityNameMock);
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

  describe('SetMyPerformanceSelectedEntityType', () => {
    let entityTypeMock: EntityType;
    let action: MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType;

    beforeEach(() => {
      entityTypeMock = getEntityTypeMock();
      action = new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(entityTypeMock);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE)
        .toBe('[My Performance] SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE');
      expect(action.type).toBe(MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(entityTypeMock);
    });
  });

  describe('SetMyPerformanceSelectedBrandCode', () => {
    let selectedBrandCodeMock: string;
    let action: MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode;

    beforeEach(() => {
      selectedBrandCodeMock = chance.string();
      action = new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(selectedBrandCodeMock);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_BRAND)
        .toBe('[My Performance] SET_MY_PERFORMANCE_SELECTED_BRAND');
      expect(action.type).toBe(MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_BRAND);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(selectedBrandCodeMock);
    });
  });

  describe('ClearMyPerformanceAction', () => {
    let action: MyPerformanceVersionActions.ClearMyPerformanceState;

    beforeEach(() => {
      action = new MyPerformanceVersionActions.ClearMyPerformanceState();
    });

    it('should have the correct type', () => {
      expect(MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE)
        .toBe('[My Performance] CLEAR_MY_PERFORMANCE_STATE');
      expect(action.type).toBe(MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE);
    });
  });
});
