import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { initialState, productMetricsViewTypeReducer } from './product-metrics-view-type.reducer';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ProductMetricsViewTypeActions from '../actions/product-metrics-view-type.action';

describe('Product Metrics View Types Reducer', () => {

  it('should store the new sales hierarchy view type', () => {
    const payload: ProductMetricsViewType = ProductMetricsViewType[getProductMetricsViewTypeMock()];

    const expectedState = {
      viewType: payload
    };

    const actualState = productMetricsViewTypeReducer(
      initialState,
      new ProductMetricsViewTypeActions.SetProductMetricsViewType(payload)
    );

    expect(actualState).toEqual(expectedState);
  });
});
