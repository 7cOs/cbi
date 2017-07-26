import * as CompassVersionActions from './compass-version.action';
import { getAppVersionMock } from '../../models/app-version.model.mock';
import * as Chance from 'chance';
let chance = new Chance();

describe('Compass Version Actions', () => {

  describe('FetchVersionAction', () => {
    let action: CompassVersionActions.FetchVersionAction;

    beforeEach(() => {
      action = new CompassVersionActions.FetchVersionAction();
    });

    it('should have the correct type', () => {
      expect(CompassVersionActions.FETCH_VERSION_ACTION).toBe('[App Version] FETCH_VERSION_ACTION');
      expect(action.type).toBe(CompassVersionActions.FETCH_VERSION_ACTION);
    });
  });

  describe('FetchVersionSuccessAction', () => {
    const version = getAppVersionMock();
    let action: CompassVersionActions.FetchVersionSuccessAction;

    beforeEach(() => {
      action = new CompassVersionActions.FetchVersionSuccessAction(version);
    });

    it('should have the correct type', () => {
      expect(CompassVersionActions.FETCH_VERSION_SUCCESS_ACTION).toBe('[App Version] FETCH_VERSION_SUCCESS_ACTION');
      expect(action.type).toBe(CompassVersionActions.FETCH_VERSION_SUCCESS_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(version);
    });
  });

  describe('FetchVersionFailureAction', () => {
    const error: Error = new Error(chance.string());
    let action: CompassVersionActions.FetchVersionFailureAction;

    beforeEach(() => {
      action = new CompassVersionActions.FetchVersionFailureAction(error);
    });

    it('should have the correct type', () => {
      expect(CompassVersionActions.FETCH_VERSION_FAILURE_ACTION).toBe('[App Version] FETCH_VERSION_FAILURE_ACTION');
      expect(action.type).toBe(CompassVersionActions.FETCH_VERSION_FAILURE_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });
});
