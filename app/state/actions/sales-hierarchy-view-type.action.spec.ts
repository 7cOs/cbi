import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import * as ViewTypeActions from './sales-hierarchy-view-type.action';

describe('View Type Actions', () => {

  describe('SetSalesHierarchyViewType', () => {
    let action: ViewTypeActions.SetSalesHierarchyViewType;

    beforeEach(() => {
      action = new ViewTypeActions.SetSalesHierarchyViewType(SalesHierarchyViewType[getSalesHierarchyViewTypeMock()]);
    });

    it('should have the correct type', () => {
      expect(ViewTypeActions.SET_SALES_HIERARCHY_VIEW_TYPE).toBe('[View Types] SET_SALES_HIERARCHY_VIEW_TYPE');
      expect(action.type).toBe(ViewTypeActions.SET_SALES_HIERARCHY_VIEW_TYPE);
    });
  });

});
