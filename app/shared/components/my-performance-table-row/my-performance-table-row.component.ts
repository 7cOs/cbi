import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Inject } from '@angular/core';

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
  @Output() onSublineClicked = new EventEmitter<any>();

  @Input() rowData: MyPerformanceTableRow;
  @Input() showOpportunities: boolean;
  @Input() showContributionToVolume: boolean;
  @Input() viewType: ViewType;

  public sortStatus = SortStatus;

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
      ['link']: this.viewType === ViewType.distributors || this.viewType === ViewType.subAccounts,
      ['forward-arrow']: this.viewType === ViewType.distributors || this.viewType === ViewType.subAccounts
    };
  }

  public sublineClicked(): void {
    if (this.viewType === ViewType.distributors || this.viewType === ViewType.subAccounts) {
      this.onSublineClicked.emit();
    }
  }
}
