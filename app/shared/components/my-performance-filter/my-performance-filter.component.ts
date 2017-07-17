import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DateRange } from '../../../models/date-range.model';
import { DateRangesState } from '../../../state/reducers/date-ranges.reducer';
import { DistributionTypeValue, MetricValue, PremiseTypeValue, TimePeriodValue } from '../../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';

@Component({
  selector: 'my-performance-filter',
  template: require('./my-performance-filter.component.pug'),
  styles: [require('./my-performance-filter.component.scss')]
})

export class MyPerformanceFilterComponent {
  @Output() onFilterChange = new EventEmitter<any>();

  @Input() set dateRanges(dateRanges: DateRangesState) {
    if (dateRanges.status === 2) this.initDateRangeData(dateRanges);
  }
  @Input() set filterState(state: MyPerformanceFilterState) {
    this.metricModel = state.metric;
    this.timePeriodModel = state.timePeriod;
    this.premiseTypeRadioModel = state.premiseType;
    this.distributionRadioModel = state.distributionType;
  }

  private metricModel: MetricValue;
  private timePeriodModel: TimePeriodValue;
  private premiseTypeRadioModel: PremiseTypeValue;
  private distributionRadioModel: DistributionTypeValue;
  private depletionTimePeriodOptions: Array<DateRange> = [];
  private distributionTimePeriodOptions: Array<DateRange> = [];
  private metricOptions: Array<any> = [ // tslint:disable-line:no-unused-variable
    { metricName: 'Depletions', metricValue: 'DEPLETIONS' },
    { metricName: 'Distribution', metricValue: 'DISTRIBUTION' },
    { metricName: 'Velocity', metricValue: 'VELOCITY' }
  ];
  private depletionsPremiseRadioOptions: Array<any> = [ // tslint:disable-line:no-unused-variable
    { premiseType: 'All', premiseTypeValue: 'ALL'},
    { premiseType: 'Off-Premise', premiseTypeValue: 'OFF-PREMISE'},
    { premiseType: 'On-Premise', premiseTypeValue: 'ON-PREMISE'}
  ];
  private distributionPremiseRadioOptions: Array<any> = [ // tslint:disable-line:no-unused-variable
    { premiseType: 'Off-Premise', premiseTypeValue: 'OFF-PREMISE'},
    { premiseType: 'On-Premise', premiseTypeValue: 'ON-PREMISE'}
  ];
  private distributionRadioOptions: Array<any> = [ // tslint:disable-line:no-unused-variable
    { distributionType: 'Simple', distributionTypeValue: 'SIMPLE'},
    { distributionType: 'Effective', distributionTypeValue: 'EFFECTIVE'}
  ];

  constructor() { }

  private initDateRangeData(dateRanges: DateRangesState) {
    const distributionOptions: Array<DateRange> = [];
    const depletionOptions: Array<DateRange> = [];

    ['CYTD', 'FYTD', 'CMIPBDL', 'LCM', 'CYTM', 'FYTM'].forEach(dateRangeCode => {
      distributionOptions.push(dateRanges[dateRangeCode]);
    });

    ['L60', 'L90', 'L120', 'L3CM'].forEach(dateRangeCode => {
      depletionOptions.push(dateRanges[dateRangeCode]);
    });

    // Re-initialize to trigger change detection in select dropdowns
    this.depletionTimePeriodOptions = distributionOptions;
    this.distributionTimePeriodOptions = depletionOptions;
  }

  private filterSelected(filterType: string, filterValue: string) { // tslint:disable-line:no-unused-variable
    this.onFilterChange.emit({ filterType, filterValue });
  }
}
