import { Component, Input, EventEmitter, Output } from '@angular/core';

import { ListPerformanceTableRow } from '../../../models/list-performance/list-performance-table-row.model';
import { MatCheckboxModule } from '@angular/material/';

@Component({
  selector: '[list-performance-table-row]',
  template: require('./list-performance-table-row.component.pug'),
  styles: [ require('../list-performance-table/list-performance-table.component.scss') ]
})
export class ListPerformanceTableRowComponent {
  @Input() rowData: ListPerformanceTableRow;

  public getTrendClass(num: number): string {
    return num >= 0 ? 'positive' : 'negative';
  }
}
