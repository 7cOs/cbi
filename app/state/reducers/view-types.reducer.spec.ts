import { getMockViewType } from '../../enums/view-type.mock.enum';
import { initialState, viewTypesReducer, ViewTypeState } from './view-types.reducer';
import { ViewType } from '../../enums/view-type.enum';
import * as ViewTypeActions from '../actions/view-types.action';

describe('View Types Reducer', () => {

  it('should store the new left data', () => {
    const payload: ViewType = ViewType[getMockViewType];

    const expectedState = {
      leftTableViewType: ViewType[getMockViewType],
      rightTableViewType: initialState.rightTableViewType
    };

    const actualState = viewTypesReducer(initialState, new ViewTypeActions.SetLeftMyPerformanceTableViewType(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should store the new right data', () => {
    const payload: ViewType = ViewType[getMockViewType];

    const expectedState = {
      leftTableViewType: initialState.leftTableViewType,
      rightTableViewType: ViewType[getMockViewType]
    };

    const actualState = viewTypesReducer(initialState, new ViewTypeActions.SetRightMyPerformanceTableViewType(payload));

    expect(actualState).toEqual(expectedState);
  });
});
