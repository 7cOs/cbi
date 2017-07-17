import { DateRangesState } from '../state/reducers/date-ranges.reducer';

export const dateRangeStateMock: DateRangesState = {
  FYTM: {
    code: 'FYTM',
    displayCode: 'FYTM',
    description: 'From First Day of Current Fiscal Year to Last Closed Month',
    range: '03/01/17 - 05/31/17'
  },
  CYTM: {
    code: 'CYTM',
    displayCode: 'CYTM',
    description: 'From First Day of Current Calendar Year to Last Closed Month',
    range: '01/01/17 - 05/31/17'
  },
  CYTD: {
    code: 'CYTDBDL',
    displayCode: 'CYTD',
    description: 'From First Day of Current Calendar Year to Date With Business Day Lag',
    range: '01/01/17 - 06/02/17'
  },
  FYTD: {
    code: 'FYTDBDL',
    displayCode: 'FYTD',
    description: 'Current Fiscal Year to Date With Business Day Lag',
    range: '03/01/17 - 06/02/17'
  },
  L60: {
    code: 'L60BDL',
    displayCode: 'L60 Days',
    description: 'Last 60 Days Of Current Year With Business Day Lag',
    range: '04/04/17 - 06/02/17'
  },
  L90: {
    code: 'L90BDL',
    displayCode: 'L90 Days',
    description: 'Last 90 Days Of Current Year With Business Day Lag',
    range: '03/05/17 - 06/02/17'
  },
  L120: {
    code: 'L120BDL',
    displayCode: 'L120 Days',
    description: 'Last 120 Days Of Current Year With Business Day Lag',
    range: '02/03/17 - 06/02/17'
  },
  LCM: {
    code: 'LCM',
    displayCode: 'Clo Mth',
    description: 'Last Closed Month Of Current Year',
    range: '05/01/17 - 05/31/17'
  },
  L3CM: {
    code: 'L3CM',
    displayCode: 'L03 Mth',
    description: 'Last 3 Closed Months',
    range: '03/01/17 - 05/31/17'
  },
  CMIPBDL: {
    code: 'CMIPBDL',
    description: 'Current Month In Progress Of Current Year With Business Day Lag',
    displayCode: 'MTD',
    range: '06/01/17 - 06/17/17'
  },
  status: 2
};
