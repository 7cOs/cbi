import { ActionStatus } from '../enums/action-status.enum';
import * as Chance from 'chance';
import { DateRangesState } from '../state/reducers/date-ranges.reducer';

const chance = new Chance();

export const dateRangeStateMock: DateRangesState = {
  FYTM: {
    code: 'FYTM',
    displayCode: 'FYTM',
    displayCodeQuarterDate: chance.string(),
    description: 'From First Day of Current Fiscal Year to Last Closed Month',
    range: '03/01/17 - 05/31/17'
  },
  CYTM: {
    code: 'CYTM',
    displayCode: 'CYTM',
    displayCodeQuarterDate: chance.string(),
    description: 'From First Day of Current Calendar Year to Last Closed Month',
    range: '01/01/17 - 05/31/17'
  },
  CCQTD: {
    code: 'CCQTD',
    displayCode: 'Clo Cal Qtr',
    displayCodeQuarterDate: chance.string(),
    description: 'Current Closed Quarter to Date',
    range: '07/01/17 - 09/30/17'
  },
  FCQTD: {
    code: 'FCQTD',
    displayCode: 'Clo Fiscal Qtr',
    displayCodeQuarterDate: chance.string(),
    description: 'Fiscal Closed Quarter to Date',
    range: '09/01/17 - 10/19/17'
  },
  CYTDBDL: {
    code: 'CYTDBDL',
    displayCode: 'CYTD',
    displayCodeQuarterDate: chance.string(),
    description: 'From First Day of Current Calendar Year to Date With Business Day Lag',
    range: '01/01/17 - 06/02/17'
  },
  CQTD: {
    code: 'CQTD',
    displayCode: 'CQTD',
    displayCodeQuarterDate: chance.string(),
    description: 'Calendar Quarter to Date',
    range: '10/1/17 - 10/11/17'
  },
  FYTDBDL: {
    code: 'FYTDBDL',
    displayCode: 'FYTD',
    displayCodeQuarterDate: chance.string(),
    description: 'Current Fiscal Year to Date With Business Day Lag',
    range: '03/01/17 - 06/02/17'
  },
  FQTD: {
    code: 'FQTD',
    displayCode: 'FQTD',
    displayCodeQuarterDate: chance.string(),
    description: 'Fiscal Quarter to Date',
    range: '12/01/17 - 01/19/18'
  },
  L60BDL: {
    code: 'L60BDL',
    displayCode: 'L60 Days',
    displayCodeQuarterDate: chance.string(),
    description: 'Last 60 Days Of Current Year With Business Day Lag',
    range: '04/04/17 - 06/02/17'
  },
  L90BDL: {
    code: 'L90BDL',
    displayCode: 'L90 Days',
    displayCodeQuarterDate: chance.string(),
    description: 'Last 90 Days Of Current Year With Business Day Lag',
    range: '03/05/17 - 06/02/17'
  },
  L120BDL: {
    code: 'L120BDL',
    displayCode: 'L120 Days',
    displayCodeQuarterDate: chance.string(),
    description: 'Last 120 Days Of Current Year With Business Day Lag',
    range: '02/03/17 - 06/02/17'
  },
  LCM: {
    code: 'LCM',
    displayCode: 'Clo Mth',
    displayCodeQuarterDate: chance.string(),
    description: 'Last Closed Month Of Current Year',
    range: '05/01/17 - 05/31/17'
  },
  L3CM: {
    code: 'L3CM',
    displayCode: 'L03 Mth',
    displayCodeQuarterDate: chance.string(),
    description: 'Last 3 Closed Months',
    range: '03/01/17 - 05/31/17'
  },
  CMIPBDL: {
    code: 'CMIPBDL',
    displayCode: 'MTD',
    displayCodeQuarterDate: chance.string(),
    description: 'Current Month In Progress Of Current Year With Business Day Lag',
    range: '06/01/17 - 06/17/17'
  },
  status: ActionStatus.Fetched
};
