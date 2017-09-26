import { Component, Input, EventEmitter, Output } from '@angular/core';

import { CssClasses } from '../../../models/css-classes.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { ViewType } from '../../../enums/view-type.enum';

@Component({
  selector: '[my-performance-table-row]',
  template: require('./my-performance-table-row.component.pug'),
  styles: [ require('../my-performance-table/my-performance-table.component.scss') ]
})
export class MyPerformanceTableRowComponent {
  @Output() onCellClicked = new EventEmitter<number>();

  @Input() rowData: MyPerformanceTableRow;
  @Input() showBackButton: boolean;
  @Input() showOpportunities: boolean;
  @Input() viewType: ViewType;
  @Input() sublineClickable: boolean;

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
      ['link']: this.sublineClickable
    };
  }
}
