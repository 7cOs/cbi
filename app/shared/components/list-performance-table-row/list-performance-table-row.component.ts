import { Component, Input, EventEmitter, Output } from '@angular/core';
import { isUndefined } from 'lodash';

import { CssClasses } from '../../../models/css-classes.model';
import { ListPerformanceTableRow } from '../../../models/list-performance/list-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
import { MatCheckboxModule } from '@angular/material/';

@Component({
  selector: '[list-performance-table-row]',
  template: require('./list-performance-table-row.component.pug'),
  styles: [ require('../list-performance-table/list-performance-table.component.scss') ]
})
export class ListPerformanceTableRowComponent {
  @Output() onSublineClicked = new EventEmitter<Event>();

  @Input() showEmptyLastColumn: boolean = false;
  @Input() set rowData(rowData: ListPerformanceTableRow) {
    this.tableRowData = rowData;
  }

  public tableRowData: ListPerformanceTableRow;

  public getTrendClass(num: number): string {
    return num >= 0 ? 'positive' : 'negative';
  }
}
