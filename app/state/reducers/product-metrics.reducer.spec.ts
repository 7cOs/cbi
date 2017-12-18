import { ActionStatus } from '../../enums/action-status.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getGroupedOpportunityCountsMock } from '../../models/opportunity-count.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricsWithBrandValuesMock } from '../../models/product-metrics.model.mock';
import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { GroupedOpportunityCounts } from '../../models/opportunity-count.model';
import { initialState, productMetricsReducer } from './product-metrics.reducer';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { ProductMetricsState } from './product-metrics.reducer';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

const positionIdMock = chance.string();
const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

describe('ProductMetrics Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {

    const expectedState = {
      status: ActionStatus.Fetching,
      opportunityCountsStatus: initialState.opportunityCountsStatus,
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
      opportunityCountsStatus: initialState.opportunityCountsStatus,
      products: products,
      productMetricsViewType: ProductMetricsViewType.brands
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
      opportunityCountsStatus: initialState.opportunityCountsStatus,
      products: initialState.products,
      productMetricsViewType: ProductMetricsViewType.brands
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.FetchProductMetricsFailure(new Error())
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update selectedBrandCodeValues with the first item in product corresponding to the given brand code in payload', () => {
    const initialStateCopy: ProductMetricsState = Object.assign({}, initialState);
    const products = getProductMetricsWithBrandValuesMock();
    const chosenProductMetricsValuesIndex = chance.natural({min: 0, max: products.brandValues.length - 1});
    const chosenBrandCode = chance.string();
    const notChosenBrancode = chosenBrandCode + 'NOT_CHOSEN';
    products.brandValues.forEach(values => {
      values.brandCode = notChosenBrancode;
    });

    products.brandValues[chosenProductMetricsValuesIndex].brandCode = chosenBrandCode;

    initialStateCopy.products = products;

    const expectedState = {
      status: initialStateCopy.status,
      opportunityCountsStatus: initialStateCopy.opportunityCountsStatus,
      products: initialStateCopy.products,
      selectedBrandCodeValues: products.brandValues[chosenProductMetricsValuesIndex],
      productMetricsViewType: ProductMetricsViewType.brands
    };

    const actualState = productMetricsReducer(
      initialStateCopy,
      new ProductMetricsActions.SelectBrandValues(chosenBrandCode)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should store the new sales hierarchy view type', () => {
    const payload: ProductMetricsViewType = ProductMetricsViewType[getProductMetricsViewTypeMock()];

    const expectedState = {
      status: initialState.status,
      opportunityCountsStatus: initialState.opportunityCountsStatus,
      products: initialState.products,
      productMetricsViewType: payload
    };

    const actualState = productMetricsReducer(
      initialState,
      new ProductMetricsActions.SetProductMetricsViewType(payload)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should delete the selectedBrandCodeValues from the state when a deselectBrandValues action is dispatched', () => {
    const initialStateCopy: ProductMetricsState = Object.assign({}, initialState);
    const products = getProductMetricsWithBrandValuesMock();

    initialStateCopy.products = products;
    initialStateCopy.selectedBrandCodeValues = products.brandValues[chance.natural({min: 0, max: products.brandValues.length - 1})];

    const expectedState = {
      status: initialStateCopy.status,
      opportunityCountsStatus: initialStateCopy.opportunityCountsStatus,
      products: initialStateCopy.products,
      productMetricsViewType: ProductMetricsViewType.brands
    };

    const actualState = productMetricsReducer(
      initialStateCopy,
      new ProductMetricsActions.DeselectBrandValues()
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(productMetricsReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });

  describe('when a FetchOpportunityCounts action is dispatched', () => {
    it('should update the opportunity counts status to Fetching', () => {
      const actionPayloadMock: ProductMetricsActions.FetchOpportunityCountsPayload = {
        positionId: chance.string(),
        alternateHierarchyId: chance.string(),
        distributorId: chance.string(),
        subAccountId: chance.string(),
        isMemberOfExceptionHierarchy: chance.bool(),
        selectedEntityType: getEntityTypeMock(),
        productMetricsViewType: getProductMetricsViewTypeMock(),
        filter: getMyPerformanceFilterMock()
      };
      const expectedState: ProductMetricsState = {
        status: initialState.status,
        opportunityCountsStatus: ActionStatus.Fetching,
        products: initialState.products,
        productMetricsViewType: initialState.productMetricsViewType
      };
      const actualState: ProductMetricsState = productMetricsReducer(
        initialState,
        new ProductMetricsActions.FetchOpportunityCounts(actionPayloadMock));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchOpportunityCountsSuccess action is dispatched', () => {
    it('should store the grouped opportunity counts and set the opportunity count status to Fetched', () => {
      const actionPayloadMock: GroupedOpportunityCounts = getGroupedOpportunityCountsMock();
      const expectedState: ProductMetricsState = {
        status: initialState.status,
        opportunityCountsStatus: ActionStatus.Fetched,
        opportunityCounts: actionPayloadMock,
        products: initialState.products,
        productMetricsViewType: initialState.productMetricsViewType
      };
      const actualState: ProductMetricsState = productMetricsReducer(
        initialState,
        new ProductMetricsActions.FetchOpportunityCountsSuccess(actionPayloadMock));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchOpportunityCountsFailure is dispatched', () => {
    it('should should update the opportunity counts status to Error', () => {
      const expectedState: ProductMetricsState = {
        status: initialState.status,
        opportunityCountsStatus: ActionStatus.Error,
        products: initialState.products,
        productMetricsViewType: initialState.productMetricsViewType
      };
      const actualState: ProductMetricsState = productMetricsReducer(
        initialState,
        new ProductMetricsActions.FetchOpportunityCountsFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });
});
