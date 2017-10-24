import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { initialState, salesHierarchyViewTypeReducer } from './sales-hierarchy-view-type.reducer';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import * as SalesHierarchyViewTypeActions from '../actions/sales-hierarchy-view-type.action';

describe('Sales Hierarchy View Types Reducer', () => {

  it('should store the new sales hierarchy view type', () => {
    const payload: SalesHierarchyViewType = SalesHierarchyViewType[getSalesHierarchyViewTypeMock()];

    const expectedState = {
      viewType: payload
    };

    const actualState = salesHierarchyViewTypeReducer(
      initialState,
      new SalesHierarchyViewTypeActions.SetSalesHierarchyViewType(payload)
    );

    expect(actualState).toEqual(expectedState);
  });
});
