import { Component, Input, OnInit } from '@angular/core';
import { DateRangeService } from '../../../services/date-range.service';
import { DateRangeTimePeriod } from '../../../enums/date-range-time-period.enum';

@Component({
  selector: 'dateranges',
  template: require('./date-ranges.component.pug'),
  styles: [require('./date-ranges.component.scss').toString()]
})

export class DateRangeComponent implements OnInit {

  @Input() dateRangeInput: string;
  private dateRangeDisplay: string;
  // private dateRangeDispla: Observable <DateRange>;

  getDateRange() {
    this.dateRangeService.getDateRange(DateRangeTimePeriod[this.dateRangeInput]).subscribe(dateRange => {
      this.dateRangeDisplay = dateRange.range;
    });
  }

  constructor(private dateRangeService: DateRangeService) {}

  ngOnInit() {
    this.getDateRange();
  }
}
