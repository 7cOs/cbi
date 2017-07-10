export interface MyPerformanceFilter {
  metric: MetricValue;
  timePeriod: TimePeriodValue;
  premiseType: PremiseTypeValue;
  distributionType: DistributionTypeValue;
}

export type MetricValue = 'DEPLETIONS' | 'DISTRIBUTION' | 'VELOCITY';

export type TimePeriodValue = 'FYTM' | 'CYTM' | 'CYTDBDL' | 'FYTDBDL' | 'L60BDL' | 'L90BDL' | 'L120BDL' | 'L3CM' | 'LCM' | 'CMIPBDL';

export type PremiseTypeValue = 'ALL' | 'OFF_PREMISE' | 'ON_PREMISE';

export type DistributionTypeValue = 'SIMPLE' | 'EFFECTIVE';
