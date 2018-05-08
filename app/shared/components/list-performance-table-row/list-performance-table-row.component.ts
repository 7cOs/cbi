import { Component, Input, EventEmitter, Output } from '@angular/core';

import { CompassListClassUtilService } from '../../../services/compass-list-class-util.service';
import { ListPerformanceTableRow } from '../../../models/list-performance/list-performance-table-row.model';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: '[list-performance-table-row]',
  template: require('./list-performance-table-row.component.pug'),
  styles: [ require('../list-performance-table/list-performance-table.component.scss') ]
})
export class ListPerformanceTableRowComponent {
  @Input() rowData: ListPerformanceTableRow;
  @Output() onChangeEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(public classUtilService: CompassListClassUtilService) { }

  public getTrendClass(num: number): string {
    return this.classUtilService.getTrendClass(num);
  }

  public toggleChecked(event: MatCheckboxChange) {
    this.rowData.checked = event.checked;
    this.onChangeEventEmitter.emit(event);
  }
}
