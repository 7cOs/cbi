import { sample } from 'lodash';

import { DrillStatus } from './drill-status.enum';

const drillStatusValues = Object.keys(DrillStatus).map(key => DrillStatus[key]);

export function getDrillStatusMock(): DrillStatus {
  return sample(drillStatusValues);
}
