import { Component, Input } from '@angular/core';

import { DateRange } from '../../../models/date-range.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { SortingCriteria } from '../my-performance-table/my-performance-table.component';

@Component({
  selector: 'my-performance-table-left',
  template: require('./my-performance-table-left.component.pug'),
  styles: [ require('./my-performance-table-left.component.scss')]
})

export class MyPerformanceTableLeftComponent {
  @Input() onElementClicked: Function;
  @Input() onSortingcriteriaChanged: Function;
  @Input() sortingCriteria: Array<SortingCriteria>;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() tableData: Array<MyPerformanceTableRow>;
  @Input() dateRange: DateRange;
  @Input() performanceMetric: string;

}
