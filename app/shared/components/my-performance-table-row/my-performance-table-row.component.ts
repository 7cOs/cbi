import { Component, Input, EventEmitter, Output } from '@angular/core';

import { CssClasses } from '../../../models/css-classes.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';

@Component({
  selector: '[my-performance-table-row]',
  template: require('./my-performance-table-row.component.pug'),
  styles: [ require('../my-performance-table/my-performance-table.component.scss') ]
})
export class MyPerformanceTableRowComponent {
  @Output() onSublineClicked = new EventEmitter<Event>();
  @Output() onDismissableRowXClicked = new EventEmitter<Event>();
  @Output() onOpportunityCountClicked = new EventEmitter<Event>();

  @Input() rowData: MyPerformanceTableRow;
  @Input() showContributionToVolume: boolean = false;
  @Input() showOpportunities: boolean = false;
  @Input() showEmptyLastColumn: boolean = false;
  @Input() showX: boolean = false;
  @Input()
  set viewType(viewType: SalesHierarchyViewType | ProductMetricsViewType) {
    this.isSubAcountsOrDistributors = viewType === SalesHierarchyViewType.distributors
      || viewType === SalesHierarchyViewType.subAccounts;
    this.isRolegroups = viewType === SalesHierarchyViewType.roleGroups;
  }
  @Input()
  set opportunitiesError(opportunitiesError: boolean) {
    this.isOpportunitiesError = opportunitiesError;
    this.opportunityCountText = this.getOpportunityCountText(this.rowData.opportunities, opportunitiesError);
  }

  public opportunityCountText: string;
  public isOpportunitiesError: boolean = false;

  private isRolegroups: boolean;
  private isSubAcountsOrDistributors: boolean;

  public getTrendClass(num: number): string {
    return num >= 0 ? 'positive' : 'negative';
  }

  public getSublineClass(): CssClasses {
    return {
      ['link']: this.isSubAcountsOrDistributors,
      ['forward-arrow']: this.isSubAcountsOrDistributors
    };
  }

  public getRolegroupIconClass(): CssClasses {
    return {
      ['geography-group-icon']: this.rowData.descriptionRow0 === 'GEOGRAPHY',
      ['account-group-icon']: this.rowData.descriptionRow0 === 'ACCOUNTS',
      ['rolegroup-icon']: this.rowData.descriptionRow0 !== 'GEOGRAPHY' && this.rowData.descriptionRow0 !== 'ACCOUNTS'
    };
  }

  public sublineClicked(event: Event): void {
    event.stopPropagation();
    if (this.isSubAcountsOrDistributors) {
      this.onSublineClicked.emit();
    }
  }

  public opportunityCountClicked(event: Event): void {
    event.stopPropagation();
    this.onOpportunityCountClicked.emit();
  }

  public getOpportunityCountText(opportunityCount: number, opportunitiesError: boolean): string {
    if (opportunitiesError) {
      return '-';
    }
    return opportunityCount ? opportunityCount.toString() : '0';
  }
}
