import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'my-performance-filter',
  template: require('./my-performance-filter.component.pug'),
  styles: [require('./my-performance-filter.component.scss')]
})

export class MyPerformanceFilterComponent {
  @Output() onFilterChange = new EventEmitter<any>();

  @Input() set dateRanges(dateRanges: any) {
    if (dateRanges.status === 2) this.initDateRangeData(dateRanges);
  }
  @Input() set filterState(state: any) {
    this.metricModel = state.metric;
    this.timePeriodModel = state.timePeriod;
    this.premiseTypeRadioModel = state.premiseType;
    this.distributionRadioModel = state.distributionType;
  }

  private depletionTimePeriodOptions: Array<any> = [];
  private distributionTimePeriodOptions: Array<any> = [];
  private metricModel: string;
  private metricOptions: Array<any> = [ // tslint:disable-line:no-unused-variable
    { metricName: 'Depletions', metricValue: 'DEPLETIONS' },
    { metricName: 'Distribution', metricValue: 'DISTRIBUTION' },
    { metricName: 'Velocity', metricValue: 'VELOCITY' }
  ];
  private premiseTypeRadioModel: string;
  private depletionsPremiseRadioOptions = [ // tslint:disable-line:no-unused-variable
    { premiseType: 'All', premiseTypeValue: 'ALL'},
    { premiseType: 'Off-Premise', premiseTypeValue: 'OFF-PREMISE'},
    { premiseType: 'On-Premise', premiseTypeValue: 'ON-PREMISE'}
  ];
  private distributionPremiseRadioOptions = [ // tslint:disable-line:no-unused-variable
    { premiseType: 'Off-Premise', premiseTypeValue: 'OFF-PREMISE'},
    { premiseType: 'On-Premise', premiseTypeValue: 'ON-PREMISE'}
  ];
  private distributionRadioModel: string;
  private distributionRadioOptions = [ // tslint:disable-line:no-unused-variable
    { distributionType: 'Simple', distributionTypeValue: 'SIMPLE'},
    { distributionType: 'Effective', distributionTypeValue: 'EFFECTIVE'}
  ];
  private timePeriodModel: any;

  constructor() { }

  private initDateRangeData(dateRanges: any) {
    const distributionOptions: Array<any> = [];
    const depletionOptions: Array<any> = [];

    ['CYTD', 'FYTD', 'CMIPBDL', 'LCM', 'CYTM', 'FYTM'].forEach(dateRangeCode => {
      distributionOptions.push(dateRanges[dateRangeCode]);
    });

    ['L60', 'L90', 'L120', 'L3CM'].forEach(dateRangeCode => {
      depletionOptions.push(dateRanges[dateRangeCode]);
    });

    this.depletionTimePeriodOptions = distributionOptions;
    this.distributionTimePeriodOptions = depletionOptions;
  }

  private filterSelected(filterType: string, filterValue: string) { // tslint:disable-line:no-unused-variable
    this.onFilterChange.emit({filterType, filterValue});
  }
}
