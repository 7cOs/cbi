import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassDropdownData } from '../../../models/compass-dropdown-data.model';
import { FormatOpportunitiesTypePipe } from '../../../pipes/formatOpportunitiesType.pipe';
import { ListTableDrawerRow } from '../../../models/lists/list-table-drawer-row.model';
import { OpportunityImpact } from '../../../enums/list-opportunities/list-opportunity-impact.enum';
import { opportunityImpactSortWeight } from '../../../models/opportunity-impact-sort-weight.model';
import { OpportunityStatus } from '../../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityTypeLabel } from '../../../enums/list-opportunities/list-opportunity-type-label.enum';

@Component({
  selector: 'list-table-drawer',
  template: require('./list-table-drawer.component.pug'),
  styles: [require('./list-table-drawer.component.scss')]
})

export class ListTableDrawerComponent {
  @Output() onCheckboxClicked: EventEmitter<Event> = new EventEmitter();
  @Output() onOpportunityTypeClicked: EventEmitter<string> = new EventEmitter();

  @Input() set tableData(tableData: ListTableDrawerRow[]) {
    if (tableData) this.sortedTableData = tableData.sort(this.sortTableData);
  }

  public opportunityImpact: any = OpportunityImpact;
  public opportunityStatus: any = OpportunityStatus;
  public sortedTableData: ListTableDrawerRow[];
  public inactiveStatusTooltip = {
    title: 'Inactive Status',
    text: [
      'This opportunity recommendation is no longer supported by data analytics (see Compass user guide for more details).',
      'Consider removing this opportunity from your list to ensure your list stays actionable and relevant.'
    ]
  };
  public compassDropdownData: CompassDropdownData = {
    data: [
      { display: 'Send To', value: 'SEND'},
      { display: 'Dismiss', value: 'DISMISS' }
    ]
  };

  public checkboxClicked(isChecked: boolean, index: number): void {
    this.sortedTableData[index].checked = isChecked;
    this.onCheckboxClicked.emit();
  }

  public opportunityTypeClicked(opportunityRow: ListTableDrawerRow): void {
    this.onOpportunityTypeClicked.emit(opportunityRow.id);
  }

  public actionButtonClicked(opportunityRow: ListTableDrawerRow): void {
    console.log('ACTION BUTTON CLICKED', opportunityRow);
  }

  public opportunityTypeConversion(opportunityRow: ListTableDrawerRow): string {
    if (opportunityRow.type === OpportunityTypeLabel.MANUAL) {
      return new FormatOpportunitiesTypePipe().transform(opportunityRow.subType);
    } else {
      return opportunityRow.type;
    }

  public getFlagClass(opportunityRow: ListTableDrawerRow): string {
    return opportunityRow.featureType.featureTypeCode && opportunityRow.itemAuthorization.itemAuthorizationCode
      ? 'flag-both'
      : opportunityRow.featureType.featureTypeCode
        ? 'flag-featured'
        : opportunityRow.itemAuthorization.itemAuthorizationCode
          ? 'flag-mandatory'
          : '';
  }

  public onCompassDropdownClicked(dropdownValue: string, opportunity: ListTableDrawerRow): void {
    console.log('onCompassDropdownClicked: ', dropdownValue, opportunity);
  }

  private sortTableData(row1: ListTableDrawerRow, row2: ListTableDrawerRow): number {
    if (row1.impact === row2.impact) {
      return row1.brand.localeCompare(row2.brand);
    } else {
      return opportunityImpactSortWeight[row1.impact] - opportunityImpactSortWeight[row2.impact];
    }
  }
}
