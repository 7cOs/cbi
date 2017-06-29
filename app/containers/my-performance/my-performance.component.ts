//tslint:disable
import { Component, OnInit } from '@angular/core';

import { DateRange } from '../../models/date-range.model';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { myPerformanceTableData } from '../../models/my-performance-table-data.model.mock';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';

@Component({
  selector: 'my-performance',
  template: require('./my-performance.component.pug')
})

export class MyPerformanceComponent implements OnInit {
  // stubbing this here for now
  private _tableHeaderRow: string[] = ['People', 'Depletions', 'CTV'];
  private _performanceMetric: string = 'Depletions';
  private _dateRange: DateRange = getDateRangeMock();
  private _tableData: MyPerformanceTableRow[] = myPerformanceTableData;
  ngOnInit() {
    console.log(this._dateRange);
  }
}
