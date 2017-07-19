import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DateRange } from '../../../models/date-range.model'; // tslint:disable-line:no-unused-variable
import { DateRangeTimePeriod } from '../../../enums/date-range-time-period.enum';
import { DateRangeService } from '../../../services/date-range.service';

@Component({
  selector: 'date-ranges',
  template: require('./date-ranges.component.pug'),
  styles: [require('./date-ranges.component.scss')]
})

export class DateRangeComponent implements OnInit {

  @Input() dateRange: number;
  private dateRangeDisplay: Observable <DateRange>;

  constructor(private dateRangeService: DateRangeService) {}

  ngOnInit() {
    this.dateRangeDisplay = this.dateRangeService.getDateRange(<DateRangeTimePeriod>this.dateRange);
  }
}
