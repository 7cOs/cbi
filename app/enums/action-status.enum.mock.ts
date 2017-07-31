import * as Chance from 'chance';

import { ActionStatus } from './action-status.enum';

let chance = new Chance();
const actionStatusValues = Object.keys(ActionStatus)
  .map(key => ActionStatus[key]);

export function getActionStatus(): ActionStatus {
  return actionStatusValues[chance.integer({min: 0, max: actionStatusValues.length - 1})];
}
