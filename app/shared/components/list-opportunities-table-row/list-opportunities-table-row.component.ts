import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassListClassUtilService } from '../../../services/compass-list-class-util.service';
import { ListOpportunitiesTableRow } from '../../../models/list-opportunities/list-opportunities-table-row.model';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: '[list-opportunities-table-row]',
  template: require('./list-opportunities-table-row.component.pug'),
  styles: [ require('../list-opportunities-table/list-opportunities-table.component.scss') ]
})
export class ListOpportunitiesTableRowComponent {
  @Input() rowData: ListOpportunitiesTableRow;

  @Output() onChangeEventEmitter: EventEmitter<any> = new EventEmitter();
  @Output() onTableRowClicked: EventEmitter<Event> = new EventEmitter();

  public classUtilService: CompassListClassUtilService = new CompassListClassUtilService();

  public getTrendClass(num: number): string {
    return this.classUtilService.getTrendClass(num);
  }

  public toggleChecked(event: MatCheckboxChange) {
    this.rowData.checked = event.checked;
    this.onChangeEventEmitter.emit(event);
  }

  public tableCellClicked(): void {
    this.onTableRowClicked.emit();
  }
}
