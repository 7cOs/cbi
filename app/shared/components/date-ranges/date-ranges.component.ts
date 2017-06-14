import { Component, Input, OnInit } from '@angular/core';
import { DateRangeService } from '../../../services/date-range.service';
import { DateRangeTimePeriod } from '../../../enums/date-range-time-period.enum';

@Component({
  selector: 'dateranges',
  template: require('./date-ranges.component.pug'),
  styles: [require('./date-ranges.component.scss').toString()]
})

export class DateRangeComponent implements OnInit {

  @Input() daterangeinput: string;
  private outcome: string;

  constructor(private dateRangeService: DateRangeService) {
  }

  getDateRange() {
    this.dateRangeService.getDateRange(DateRangeTimePeriod[this.daterangeinput]).subscribe(dateRange => {
      this.outcome = dateRange.range;
    });
  }

  ngOnInit() {
    this.getDateRange();
  }
}
