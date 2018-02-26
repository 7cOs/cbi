import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionStatus } from '../../../enums/action-status.enum';
import { CompassRadioOption } from '../../../models/compass-radio-component.model';
import { CompassSelectOption } from '../../../models/compass-select-component.model';
import { DateRangesState } from '../../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../../enums/date-range-time-period.enum';
import { depletionsPremiseOptionsModel,
         distributionOptionsModel,
         distributionPremiseOptionsModel,
         metricOptionsModel,
         MyPerformanceFilterEvent } from '../../../models/my-performance-filter.model';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterActionType } from '../../../enums/my-performance-filter.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';

@Component({
  selector: 'my-performance-filter',
  template: require('./my-performance-filter.component.pug'),
  styles: [require('./my-performance-filter.component.scss')]
})

export class MyPerformanceFilterComponent {
  @Output() onFilterChange = new EventEmitter<MyPerformanceFilterEvent>();

  @Input() filterState: MyPerformanceFilterState;
  @Input() set dateRangeState(dateRangeState: DateRangesState) {
    if (dateRangeState && dateRangeState.status === ActionStatus.Fetched) {
      this.depletionTimePeriodOptions = this.initDateRanges('depletions', dateRangeState);
      this.distributionTimePeriodOptions = this.initDateRanges('distribution', dateRangeState);
    }
  }

  public depletionsPremiseOptions: Array<CompassRadioOption> = depletionsPremiseOptionsModel;
  public depletionTimePeriodOptions: Array<CompassSelectOption> = [];
  public distributionOptions: Array<CompassRadioOption> = distributionOptionsModel;
  public distributionPremiseOptions: Array<CompassRadioOption> = distributionPremiseOptionsModel;
  public distributionTimePeriodOptions: Array<CompassSelectOption> = [];
  public myPerformanceFilterActionType = MyPerformanceFilterActionType;
  public metricOptions: Array<CompassSelectOption> = metricOptionsModel;
  public metricTypeValue = MetricTypeValue;

  private depletionDateRangeCodes: Array<DateRangeTimePeriodValue> = [
    DateRangeTimePeriodValue.CYTDBDL,
    DateRangeTimePeriodValue.FYTDBDL,
    DateRangeTimePeriodValue.CMIPBDL,
    DateRangeTimePeriodValue.LCM,
    DateRangeTimePeriodValue.CYTM,
    DateRangeTimePeriodValue.FYTM,
    DateRangeTimePeriodValue.CQTD,
    DateRangeTimePeriodValue.FQTD,
    DateRangeTimePeriodValue.CCQTD,
    DateRangeTimePeriodValue.FCQTD
  ];
  private distributionDateRangeCodes: Array<DateRangeTimePeriodValue> = [
    DateRangeTimePeriodValue.L60BDL,
    DateRangeTimePeriodValue.L90BDL,
    DateRangeTimePeriodValue.L120BDL,
    DateRangeTimePeriodValue.L3CM
  ];

  public filterSelected(filterType: MyPerformanceFilterActionType, filterValue: any): void {
    this.onFilterChange.emit({ filterType, filterValue });
  }

  private initDateRanges(dateType: string, dateRangeState: DateRangesState): Array<CompassSelectOption> {
    const initDateRangeData = (
      dateRangeTimePeriods: Array<DateRangeTimePeriodValue>,
      dateRangeObject: DateRangesState
    ): Array<CompassSelectOption> => {
      return dateRangeTimePeriods.map(dateRangeTimePeriod => {
        let displayValue = '';
        let subDisplayValue = '';
        let codeValue = '';
        if (dateRangeObject[dateRangeTimePeriod]) {
          displayValue = dateRangeObject[dateRangeTimePeriod].displayCodeQuarterDate;
          subDisplayValue = dateRangeObject[dateRangeTimePeriod].range;
          codeValue = DateRangeTimePeriodValue[dateRangeObject[dateRangeTimePeriod].code];
        }
        return {
          display: displayValue,
          subDisplay: subDisplayValue,
          value: codeValue
        };
      });
    };

    return dateType === 'depletions'
      ? initDateRangeData(this.depletionDateRangeCodes, dateRangeState)
      : initDateRangeData(this.distributionDateRangeCodes, dateRangeState);
  }
}
