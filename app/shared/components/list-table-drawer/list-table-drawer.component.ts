import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ListTableDrawerRow } from '../../../models/lists/list-table-drawer-row.model';
import { OpportunityImpact } from '../../../enums/list-opportunities/list-opportunity-impact.enum';
import { opportunityImpactSortWeight } from '../../../models/opportunity-impact-sort-weight.model';

@Component({
  selector: 'list-table-drawer',
  template: require('./list-table-drawer.component.pug'),
  styles: [require('./list-table-drawer.component.scss')]
})

export class ListTableDrawerComponent {
  @Output() onCheckboxClicked: EventEmitter<Event> = new EventEmitter();
  @Output() onOpportunityTypeClicked: EventEmitter<ListTableDrawerRow> = new EventEmitter();
  @Output() onActionButtonClicked: EventEmitter<Event> = new EventEmitter();

  @Input() set tableData(tableData: ListTableDrawerRow[]) {
    if (tableData) this.sortedTableData = tableData.sort(this.sortTableData);
  }

  public opportunityImpact: any = OpportunityImpact;
  public sortedTableData: ListTableDrawerRow[];

  public checkboxClicked(isChecked: boolean, index: number): void {
    this.sortedTableData[index].checked = isChecked;
    this.onCheckboxClicked.emit();
  }

  public opportunityTypeClicked(opportunityRow: ListTableDrawerRow): void {
    this.onOpportunityTypeClicked.emit(opportunityRow);
  }

  public actionButtonClicked(): void {
    this.onActionButtonClicked.emit();
  }

  private sortTableData(row1: ListTableDrawerRow, row2: ListTableDrawerRow): number {
    if (row1.impact === row2.impact) {
      return row1.brand.localeCompare(row2.brand);
    } else {
      return opportunityImpactSortWeight[row1.impact] - opportunityImpactSortWeight[row2.impact];
    }
  }
}
