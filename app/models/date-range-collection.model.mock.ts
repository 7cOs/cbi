import { DateRange } from './date-range.model';

export const dateRangeCollectionMock: DateRange[] = [
  {
    code: 'L60BDL',
    displayCode: 'L60 Days',
    displayCodeQuarterDate: 'L60 Days',
    description: 'Last 60 Days Of Current Year With Business Day Lag',
    range: '04/04/17 - 06/02/17'
  },
  {
    code: 'L90BDL',
    displayCode: 'L90 Days',
    displayCodeQuarterDate: 'L90 Days',
    description: 'Last 90 Days Of Current Year With Business Day Lag',
    range: '03/05/17 - 06/02/17'
  },
  {
    code: 'CYTM',
    displayCode: 'CYTM',
    displayCodeQuarterDate: 'CYTM',
    description: 'From First Day of Current Calendar Year to Last Closed Month',
    range: '01/01/17 - 05/31/17'
  },
  {
    code: 'FYTM',
    displayCode: 'FYTM',
    displayCodeQuarterDate: 'FYTM',
    description: 'From First Day of Current Fiscal Year to Last Closed Month',
    range: '03/01/17 - 05/31/17'
  },
  {
    code: 'CCQTD',
    displayCode: 'Clo Cal Qtr',
    displayCodeQuarterDate: 'Clo Cal Qtr',
    description: 'Current Closed Quarter to Date',
    range: '07/01/17 - 09/30/17'
  },
  {
    code: 'FCQTD',
    displayCode: 'Clo Fiscal Qtr',
    displayCodeQuarterDate: 'Clo Fiscal Qtr',
    description: 'Fiscal Closed Quarter to Date',
    range: '09/01/17 - 10/19/17'},
  {
    code: 'FYTDBDL',
    displayCode: 'FYTD',
    displayCodeQuarterDate: 'FYTD',
    description: 'Current Fiscal Year to Date With Business Day Lag',
    range: '03/01/17 - 06/02/17'
  },
  {
    code: 'L3CM',
    displayCode: 'L03 Mth',
    displayCodeQuarterDate: 'L03 Mth',
    description: 'Last 3 Closed Months',
    range: '03/01/17 - 05/31/17'
  },
  {
    code: 'LCM',
    displayCode: 'Clo Mth',
    displayCodeQuarterDate: 'Clo Mth',
    description: 'Last Closed Month Of Current Year',
    range: '05/01/17 - 05/31/17'
  },
  {
    code: 'CMIPBDL',
    displayCode: 'MTD',
    displayCodeQuarterDate: 'MTD',
    description: 'Current Month In Progress Of Current Year With Business Day Lag',
    range: '06/01/17 - 06/17/17'
  },
  {
    code: 'L120BDL',
    displayCode: 'L120 Days',
    displayCodeQuarterDate: 'L120 Days',
    description: 'Last 120 Days Of Current Year With Business Day Lag',
    range: '02/03/17 - 06/02/17'
  },
  {
    code: 'CYTDBDL',
    displayCode: 'CYTD',
    displayCodeQuarterDate: 'CYTD',
    description: 'From First Day of Current Calendar Year to Date With Business Day Lag',
    range: '01/01/17 - 06/02/17'
  },
  {
    code: 'CQTD',
    displayCode: 'CQTD',
    displayCodeQuarterDate: 'CQTD',
    description: 'Calendar Quarter to Date',
    range: '10/01/17 - 10/11/17'
  },
  {
    code: 'FQTD',
    displayCode: 'FQTD',
    displayCodeQuarterDate: 'FQTD',
    description: 'Fiscal Quarter to Date',
    range: '12/01/17 - 01/19/18'
  }
];
