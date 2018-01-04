import { sample } from 'lodash';

import { LoadingState } from './loading-state.enum';

const loadingStateValues = Object.keys(LoadingState).map(key => LoadingState[key]);

export function getLoadingStateMock(): LoadingState {
  return sample(loadingStateValues);
}
