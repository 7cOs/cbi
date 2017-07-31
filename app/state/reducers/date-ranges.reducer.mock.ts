import { DateRangesState } from './date-ranges.reducer';
import { getActionStatus } from '../../enums/action-status.enum.mock';
import { getDateRangeMock } from '../../models/date-range.model.mock';

export function getDateRangesStateMock(): DateRangesState {
  return {
    status: getActionStatus(),
    FYTM: getDateRangeMock(),
    CYTM: getDateRangeMock(),
    CYTD: getDateRangeMock(),
    FYTD: getDateRangeMock(),
    L60: getDateRangeMock(),
    L90: getDateRangeMock(),
    L120: getDateRangeMock(),
    LCM: getDateRangeMock(),
    L3CM: getDateRangeMock(),
    CMIPBDL: getDateRangeMock()
  };
}
