import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'my-performance-filter',
  template: require('./my-performance-filter.component.pug')
})

export class MyPerformanceFilterComponent {
  @Output() onFilterChange = new EventEmitter<any>();

  @Input() set dateRanges(dateRanges: any) {
    if (dateRanges.status === 2) this.initDateRangeData(dateRanges);
  }
  @Input() set filterState(state: any) {
    this.metricModel = state.metric;
    this.timePeriodModel = state.timePeriod;
  }

  private depletionTimePeriodOptions: Array<any> = [];
  private distributionTimePeriodOptions: Array<any> = [];
  private metricModel: string;
  private metricOptions: Array<any> = [ // tslint:disable-line:no-unused-variable
    { metricName: 'Depletions', metricValue: 'DEPLETIONS' },
    { metricName: 'Distribution', metricValue: 'DISTRIBUTION' },
    { metricName: 'Velocity', metricValue: 'VELOCITY' }
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
