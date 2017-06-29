import { Component, Input } from '@angular/core';
import { MyPerformanceTableRow } from '../my-performance-table/my-performance-table.component';

@Component({
  selector: 'my-performance-table-row',
  template: require('./my-performance-table-row.component.pug'),
  styles: [ require('./my-performance-table-row.component.scss')]
})
export class MyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;

  constructor() { }

  ngOnInit() { }
}
