import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ListTableDrawerRow } from '../../../models/lists/list-table-drawer-row.model';
import { OpportunityImpact } from '../../../enums/list-opportunities/list-opportunity-impact.enum';

@Component({
  selector: 'list-table-drawer',
  template: require('./list-table-drawer.component.pug'),
  styles: [require('./list-table-drawer.component.scss')]
})

export class ListTableDrawerComponent {
  @Output() onOpportunityCheckboxClicked: EventEmitter<Event> = new EventEmitter();
  @Output() onOpportunityTypeClicked: EventEmitter<string> = new EventEmitter();

  @Input() tableData: ListTableDrawerRow[];

  public opportunityImpact: any = OpportunityImpact;

  public onCheckboxClick(isChecked: boolean, index: number): void {
    this.tableData[index].checked = isChecked;
    this.onOpportunityCheckboxClicked.emit();
  }

  public onTypeClicked(opportunityRow: ListTableDrawerRow): void {
    this.onOpportunityTypeClicked.emit(opportunityRow.id);
  }

  public onActionButtonClicked(): void {
    console.log('Table Drawer Action Button Clicked');
  }
}
