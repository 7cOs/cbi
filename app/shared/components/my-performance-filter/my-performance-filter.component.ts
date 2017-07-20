// tslint:disable:no-unused-variable
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionStatus } from '../../../enums/action-status.enum';
import { CompassSelectOption } from '../../../models/compass-select-component.model';
import { DateRange } from '../../../models/date-range.model';
import { DateRangesState } from '../../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../../enums/distribution-type.enum';
import {
  depletionsPremiseOptionsModel,
  distributionOptionsModel,
  distributionPremiseOptionsModel,
  metricOptionsModel,
  MyPerformanceFilter
} from '../../../models/my-performance-filter.model';
import { MetricValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../../../enums/premise-type.enum';

@Component({
  selector: 'my-performance-filter',
  template: require('./my-performance-filter.component.pug'),
  styles: [require('./my-performance-filter.component.scss')]
})

export class MyPerformanceFilterComponent {
  @Output() onFilterChange = new EventEmitter<{ filterType: string, filterValue: any }>();

  @Input() filterState: MyPerformanceFilterState;
  @Input() set dateRanges(dateRanges: DateRangesState) {
    if (dateRanges.status === ActionStatus.Fetched) {
      this.depletionTimePeriodOptions = this.initDateRanges('depletions', dateRanges);
      this.distributionTimePeriodOptions = this.initDateRanges('distribution', dateRanges);
    }
  }

  // private performanceFilterState: MyPerformanceFilterState;
  private depletionsPremiseOptions: Array<{ premiseType: string, premiseTypeValue: PremiseTypeValue }> = depletionsPremiseOptionsModel;
  private depletionTimePeriodOptions: Array<CompassSelectOption> = [];
  private distributionOptions: Array<{ distributionType: string, distributionTypeValue: DistributionTypeValue }> = distributionOptionsModel;
  private distributionPremiseOptions: Array<{ premiseType: string, premiseTypeValue: PremiseTypeValue }> = distributionPremiseOptionsModel;
  private distributionTimePeriodOptions: Array<CompassSelectOption> = [];
  private metricOptions: Array<CompassSelectOption> = metricOptionsModel;
  private metricValueEnum: any = MetricValue;

  private initDateRanges(dateType: string, dateRanges: DateRangesState): Array<CompassSelectOption> {
    const depletionDateRangeCodes: Array<string> = ['CYTD', 'FYTD', 'CMIPBDL', 'LCM', 'CYTM', 'FYTM'];
    const distributionDateRangeCodes: Array<string> = ['L60', 'L90', 'L120', 'L3CM'];

    const initDateRangeData = (dateRangeCodes: Array<string>, dateRangeObject: DateRangesState): Array<CompassSelectOption> => {
      return dateRangeCodes.map(dateCode => {
        return {
          display: dateRangeObject[dateCode].displayCode,
          subDisplay: dateRangeObject[dateCode].range,
          value: DateRangeTimePeriodValue[dateRangeObject[dateCode].code]
        };
      });
    };

    return dateType === 'depletions'
      ? initDateRangeData(depletionDateRangeCodes, dateRanges)
      : initDateRangeData(distributionDateRangeCodes, dateRanges);
  }

  private filterSelected(filterType: string, filterValue: any): void { // tslint:disable-line:no-unused-variable
    this.onFilterChange.emit({ filterType, filterValue });
  }
}
