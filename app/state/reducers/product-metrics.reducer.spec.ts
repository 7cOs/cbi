import { ActionStatus } from '../../enums/action-status.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricsWithBrandValuesMock, getProductMetricsWithSkuValuesMock } from '../../models/product-metrics.model.mock';
import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { initialState, productMetricsReducer } from './product-metrics.reducer';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

const positionIdMock = chance.string();
const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

fdescribe('ProductMetrics Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {

    const expectedState = {
      status: ActionStatus.Fetching,
      products: initialState.products,
      productMetricsViewType: ProductMetricsViewType.brands
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
      products: products,
      productMetricsViewType: initialState.productMetricsViewType
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
      products: initialState.products,
      productMetricsViewType: initialState.productMetricsViewType
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.FetchProductMetricsFailure(new Error())
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update selectedBrandCodeValues with the first item in product corresponding to the given brand code in payload', () => {
    const products = getProductMetricsWithBrandValuesMock();
    const chosenProductMetricsValuesIndex = chance.natural({min: 0, max: products.brandValues.length - 1});
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
      selectedBrandCodeValues: products.brandValues[chosenProductMetricsValuesIndex],
      productMetricsViewType: initialState.productMetricsViewType
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.SelectBrandValues(chosenBrandCode)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update selectedSkuCodeValues with the first item in product corresponding to the given sku code in payload', () => {
    const products = getProductMetricsWithSkuValuesMock();
    const chosenProductMetricsValuesIndex = chance.natural({min: 0, max: products.skuValues.length - 1});
    const chosenSkuCode = chance.string();
    const notChosenSkuCode = chosenSkuCode + 'NOT_CHOSEN';
    products.skuValues.forEach(values => {
      values.beerId.masterPackageSKUCode = notChosenSkuCode;
    });

    products.skuValues[chosenProductMetricsValuesIndex].beerId.masterPackageSKUCode = chosenSkuCode;

    initialState.products = products;
    initialState.productMetricsViewType = ProductMetricsViewType.skus;

    const expectedState = {
      status: initialState.status,
      products: initialState.products,
      selectedSkuCodeValues: products.skuValues[chosenProductMetricsValuesIndex],
      productMetricsViewType: initialState.productMetricsViewType
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.SelectSkuValues(chosenSkuCode)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update clearSkuCodeValues', () => {
    const products = getProductMetricsWithSkuValuesMock();
    const chosenProductMetricsValuesIndex = chance.natural({min: 0, max: products.skuValues.length - 1});

    initialState.products = products;
    initialState.productMetricsViewType = ProductMetricsViewType.skus;

    products.skuValues[chosenProductMetricsValuesIndex] = null;

    const expectedState = {
      status: initialState.status,
      products: initialState.products,
      selectedSkuCodeValues: products.skuValues[chosenProductMetricsValuesIndex],
      productMetricsViewType: initialState.productMetricsViewType
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.ClearSkuValues()
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should store the new sales hierarchy view type', () => {
    const payload: ProductMetricsViewType = ProductMetricsViewType[getProductMetricsViewTypeMock()];

    const expectedState = {
      status: initialState.status,
      products: initialState.products,
      productMetricsViewType: payload
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.SetProductMetricsViewType(payload)
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
