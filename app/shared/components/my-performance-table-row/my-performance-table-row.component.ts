import { Component, Input, EventEmitter, Output } from '@angular/core';

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
  @Input() showBackButton: boolean;
  @Input() showOpportunities: boolean;
  @Input() viewType: SalesHierarchyViewType | ProductMetricsViewType;

  public sortStatus = SortStatus;

  public getTrendClass(num: number): string {
    return num >= 0 ? 'positive' : 'negative';
  }

  public columnWidth(): string {
    return this.showOpportunities ? 'col-16-pct' : 'col-20-pct';
  }

  public getHeaderLeftClasses(): CssClasses {
    return {
      [this.columnWidth()]: true,
      ['back-button']: this.showBackButton
    };
  }

  public getSublineClass(): CssClasses {
    return {
      ['link']: this.viewType === SalesHierarchyViewType.distributors, // TODO: Check if that would work if I pass in a PM VT
      ['forward-arrow']: this.viewType === SalesHierarchyViewType.distributors
    };
  }

  public sublineClicked(): void {
    if (this.viewType === SalesHierarchyViewType.distributors) {
      this.onSublineClicked.emit();
    }
  }
}
