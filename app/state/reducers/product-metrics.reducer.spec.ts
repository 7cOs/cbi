import { ActionStatus } from '../../enums/action-status.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricsWithBrandValuesMock } from '../../models/product-metrics.model.mock';
import { initialState, productMetricsReducer } from './product-metrics.reducer';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import * as ProductMetricsActions from '../actions/product-metrics.action';

const positionIdMock = chance.string();
const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

describe('ProductMetrics Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {

    const expectedState = {
      status: ActionStatus.Fetching,
      products: initialState.products
    };

    const actualState = productMetricsReducer(initialState, new ProductMetricsActions.FetchProductMetrics({
      positionId: positionIdMock,
      filter: performanceFilterStateMock,
      selectedEntityType: EntityType.Person
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should store the payload when a fetch ProductMetrics is successful', () => {
    const products = getProductMetricsWithBrandValuesMock();

    const payloadMock = {
      positionId: positionIdMock,
      products: products
    };

    const expectedState = {
      status: ActionStatus.Fetched,
      products: products
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.FetchProductMetricsSuccess(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      products: initialState.products
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.FetchProductMetricsFailure(new Error())
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(productMetricsReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
