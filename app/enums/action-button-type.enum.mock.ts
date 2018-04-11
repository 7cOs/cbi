import { sample } from 'lodash';

import { ActionButtonType } from './action-button-type.enum';

const actionButtonTypeValues = Object.keys(ActionButtonType).map(key => ActionButtonType[key]);

export function getActionButtonTypeValueMock(): ActionButtonType {
  return sample(actionButtonTypeValues);
}
