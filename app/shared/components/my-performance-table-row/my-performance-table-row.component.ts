import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Inject } from '@angular/core';

import { CssClasses } from '../../../models/css-classes.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { SortStatus } from '../../../enums/sort-status.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';

@Component({
  selector: '[my-performance-table-row]',
  template: require('./my-performance-table-row.component.pug'),
  styles: [ require('../my-performance-table/my-performance-table.component.scss') ]
})
export class MyPerformanceTableRowComponent {
  @Output() onCellClicked = new EventEmitter<number>();
  @Output() onSublineClicked = new EventEmitter<any>();

  @Input() rowData: MyPerformanceTableRow;
  @Input() showContributionToVolume: boolean = false;
  @Input() showOpportunities: boolean = false;
  @Input()
  set viewType(viewType: SalesHierarchyViewType | ProductMetricsViewType) {
    this.isSubAcountsOrDistributors = viewType === SalesHierarchyViewType.distributors
      || viewType === SalesHierarchyViewType.subAccounts;
  }

  public sortStatus = SortStatus;

  private isSubAcountsOrDistributors: boolean;

  constructor(
    @Inject('ieHackService') private ieHackService: any
  ) { }

  public getTrendClass(num: number): string {
    return num >= 0 ? 'positive' : 'negative';
  }

  public columnWidth(): string {
    return this.showOpportunities
      ? ((this.ieHackService.isIE || this.ieHackService.isEdge) ? 'col-17-pct' : 'col-16-pct') : 'col-20-pct';
  }

  public getHeaderLeftClasses(): CssClasses {
    return {
      [this.columnWidth()]: true,
    };
  }

  public getSublineClass(): CssClasses {
    return {
      ['link']: this.isSubAcountsOrDistributors,
      ['forward-arrow']: this.isSubAcountsOrDistributors
    };
  }

  public sublineClicked(): void {
    if (this.isSubAcountsOrDistributors) {
      this.onSublineClicked.emit();
    }
  }
}
