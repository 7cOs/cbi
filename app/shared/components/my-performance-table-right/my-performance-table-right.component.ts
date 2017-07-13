import { Component, Input } from '@angular/core';

import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { SortingCriteria } from '../my-performance-table/my-performance-table.component';

@Component({
  selector: 'my-performance-table-right',
  template: require('./my-performance-table-right.component.pug'),
  styles: [ require('./my-performance-table-right.component.scss')]
})

export class MyPerformanceTableRightComponent {
  @Input() onElementClicked: Function;
  @Input() onSortingCriteriaChanged: Function;
  @Input() sortingCriteria: Array<SortingCriteria>;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() tableData: Array<MyPerformanceTableRow>;
  @Input() performanceMetric: string;

}
