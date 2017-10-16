import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ViewTypeActions from './product-metrics-view-type.action';

describe('View Type Actions', () => {

  describe('SetRightMyPerformanceTableViewType', () => {
    let action: ViewTypeActions.SetProductMetricsViewType;

    beforeEach(() => {
      action = new ViewTypeActions.SetProductMetricsViewType(ProductMetricsViewType[getProductMetricsViewTypeMock()]);
    });

    it('should have the correct type', () => {
      expect(ViewTypeActions.SET_PRODUCT_METRICS_VIEW_TYPE).toBe('[View Types] SET_PRODUCT_METRICS_VIEW_TYPE');
      expect(action.type).toBe(ViewTypeActions.SET_PRODUCT_METRICS_VIEW_TYPE);
    });
  });

});
