import { getViewTypeMock } from '../../enums/view-type.enum.mock';
import { initialState, viewTypesReducer, ViewTypeState } from './view-types.reducer';
import { ViewType } from '../../enums/view-type.enum';
import * as ViewTypeActions from '../actions/view-types.action';

describe('View Types Reducer', () => {

  it('should store the new left data', () => {
    const payload: ViewType = ViewType[getViewTypeMock()];

    const expectedState = {
      leftTableViewType: payload,
      rightTableViewType: initialState.rightTableViewType
    };

    const actualState = viewTypesReducer(initialState, new ViewTypeActions.SetLeftMyPerformanceTableViewType(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should store the new right data', () => {
    const payload: ViewType = ViewType[getViewTypeMock()];

    const expectedState = {
      leftTableViewType: initialState.leftTableViewType,
      rightTableViewType: payload
    };

    const actualState = viewTypesReducer(initialState, new ViewTypeActions.SetRightMyPerformanceTableViewType(payload));

    expect(actualState).toEqual(expectedState);
  });
});
