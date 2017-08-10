import { getMockViewType } from '../../enums/view-type.mock.enum';
import { ViewType } from '../../enums/view-type.enum';
import * as ViewTypeActions from './view-types.action';

describe('View Type Actions', () => {

  describe('SetLeftMyPerformanceTableViewType', () => {
    let action: ViewTypeActions.SetLeftMyPerformanceTableViewType;

    beforeEach(() => {
      action = new ViewTypeActions.SetLeftMyPerformanceTableViewType(ViewType[getMockViewType]);
    });

    it('should have the correct type', () => {
      expect(ViewTypeActions.SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE).toBe('[View Types] SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE');
      expect(action.type).toBe(ViewTypeActions.SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE);
    });
  });

  describe('SetRightMyPerformanceTableViewType', () => {
    let action: ViewTypeActions.SetRightMyPerformanceTableViewType;

    beforeEach(() => {
      action = new ViewTypeActions.SetRightMyPerformanceTableViewType(ViewType[getMockViewType]);
    });

    it('should have the correct type', () => {
      expect(ViewTypeActions.SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE).toBe('[View Types] SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE');
      expect(action.type).toBe(ViewTypeActions.SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE);
    });
  });

});
