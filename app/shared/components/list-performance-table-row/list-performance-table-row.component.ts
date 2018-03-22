import { Component, Input, EventEmitter, Output } from '@angular/core';
import { isUndefined } from 'lodash';

import { CssClasses } from '../../../models/css-classes.model';
import { ListPerformanceTableRow } from '../../../models/list-performance/list-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';

@Component({
  selector: '[list-performance-table-row]',
  template: require('./list-performance-table-row.component.pug'),
  styles: [ require('../list-performance-table/list-performance-table.component.scss') ]
})
export class ListPerformanceTableRowComponent {
  @Output() onSublineClicked = new EventEmitter<Event>();
  @Output() onDismissibleRowXClicked = new EventEmitter<Event>();
  @Output() onOpportunityCountClicked = new EventEmitter<Event>();

  @Input() showContributionToVolume: boolean = false;
  @Input() showOpportunities: boolean = false;
  @Input() showEmptyLastColumn: boolean = false;
  @Input() showX: boolean = false;
  @Input() set rowData(rowData: ListPerformanceTableRow) {
    this.tableRowData = rowData;
    this.opportunityCountClass = this.getOpportunityCountClass();
  }
  @Input()
  set viewType(viewType: SalesHierarchyViewType | ProductMetricsViewType) {
    this.isBrands = viewType === ProductMetricsViewType.brands;
    this.isSubAcountsOrDistributors = viewType === SalesHierarchyViewType.distributors
      || viewType === SalesHierarchyViewType.subAccounts;
    this.isRolegroups = viewType === SalesHierarchyViewType.roleGroups;
    this.opportunityCountClass = this.getOpportunityCountClass();
  }
  @Input()
  set opportunitiesError(opportunitiesError: boolean) {
    this.isOpportunitiesError = opportunitiesError;
    this.opportunityCountText = this.getOpportunityCountText(this.tableRowData.opportunities, opportunitiesError);
    this.opportunityCountClass = this.getOpportunityCountClass();
  }

  public opportunityCountText: string;
  public isOpportunitiesError: boolean = false;
  public opportunityCountClass: CssClasses;
  public tableRowData: ListPerformanceTableRow;

  private isBrands: boolean;
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

  public getOpportunityCountClass(): CssClasses {
    let opportunitiesClass: boolean;

    if (this.tableRowData && !isUndefined(this.tableRowData.opportunities)) {
      opportunitiesClass = (this.tableRowData.opportunities > 0) || (this.isBrands && this.tableRowData.opportunities === 0);
    } else
      opportunitiesClass = false;

    return {
      ['opportunities']: opportunitiesClass,
      ['opportunities-error']: this.isOpportunitiesError
    };
  }

  public getRolegroupIconClass(): CssClasses {
    return {
      ['geography-group-icon']: this.tableRowData.descriptionRow0 === 'GEOGRAPHY',
      ['account-group-icon']: this.tableRowData.descriptionRow0 === 'ACCOUNTS',
      ['rolegroup-icon']: this.tableRowData.descriptionRow0 !== 'GEOGRAPHY' && this.tableRowData.descriptionRow0 !== 'ACCOUNTS'
    };
  }

  public sublineClicked(event: Event): void {
    event.stopPropagation();
    if (this.isSubAcountsOrDistributors) {
      this.onSublineClicked.emit();
    }
  }

  public opportunityCountClicked(event: Event): void {
    if (!this.isBrands || this.opportunityCountText === '0') {
      event.stopPropagation();
      this.onOpportunityCountClicked.emit();
    }
  }

  public getOpportunityCountText(opportunityCount: number, opportunitiesError: boolean): string {
    if (opportunitiesError) {
      return '-';
    } else if (this.isBrands) {
      return 'View';
    }
    return opportunityCount ? opportunityCount.toString() : '0';
  }
}
