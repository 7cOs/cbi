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
    const products = getProductMetricsWithBrandValuesMock(1, 9);

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

  it('should update selectedBrandValues with the first item in product corresponding to the given brand code in payload', () => {
    const products = getProductMetricsWithBrandValuesMock(1, 9);
    const chosenProductMetricsValuesIndex = chance.natural({min: 1, max: products.brandValues.length - 1});
    const chosenBrandCode = chance.string();
    const notChosenBrancode = chosenBrandCode + 'NOT_CHOSEN';
    products.brandValues.forEach(values => {
      values.brandCode = notChosenBrancode;
    });

    products.brandValues[chosenProductMetricsValuesIndex].brandCode = chosenBrandCode;

    initialState.products = products;

    const expectedState = {
      status: initialState.status,
      products: initialState.products,
      selectedBrandValues: products.brandValues[chosenProductMetricsValuesIndex]
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.SelectBrandValues(chosenBrandCode)
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
