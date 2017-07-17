// tslint:disable
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ColumnType } from '../../../enums/column-type.enum';
import { DateRange } from '../../../models/date-range.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { ViewType } from '../../../enums/view-type.enum';

@Component({
  selector: 'my-performance-table',
  template: require('./my-performance-table.component.pug'),
  styles: [ require('./my-performance-table.component.scss') ]
})
export class MyPerformanceTableComponent {
  @Output() onElementClicked = new EventEmitter<{row: MyPerformanceTableRow, index: number}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();

  @Input()
  set sortingCriteria(criteria: Array<SortingCriteria>) {
    this._sortingCriteria = criteria;
    this.updateSortingFunction();
    if (this._tableData && this._tableData.length) {
      this._tableData = this._tableData.sort(this.sortingFunction);
    }
  }

  @Input()
  set tableData(tableData: Array<MyPerformanceTableRow>) {
    this._tableData = tableData;
    if (typeof this.sortingFunction === 'function') {
      this._tableData = this._tableData.sort(this.sortingFunction);
    }
  }

  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() showOpportunities: boolean;


  private sortingFunction: (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = null;
  private _tableData: Array<MyPerformanceTableRow>;
  private columnType = ColumnType; // for use in template
  private viewType = ViewType; // for use in template

  private updateSortingFunction() {
    if (this._sortingCriteria.length) {
      this.sortingFunction = (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => {
        let i = 0;
        let currentColumn;
        let currentSortOrder;
        do {
          currentColumn = ColumnType[this._sortingCriteria[i].columnType];
          currentSortOrder = this.compareObjects(elem0[currentColumn], (elem1[currentColumn]));
          i++;
        } while (i < this._sortingCriteria.length && currentSortOrder === 0);
        return this._sortingCriteria[--i].ascending ? currentSortOrder : -currentSortOrder;
      };
    }
  }

  private compareObjects(a: any, b: any) {
    return a < b
      ? -1
      : a > b
        ? 1
        : 0;
  }

  private clickOn(row: MyPerformanceTableRow, index: number) {
    console.log('clicked on ', row);
    this.onElementClicked.emit({row: row, index: index});
  }

  private sortRows(colType: ColumnType) {
    // keeping this one-dimensional for now
    const ascending = this._sortingCriteria[0].columnType === colType
      ? !this._sortingCriteria[0].ascending
      : colType === ColumnType.descriptionLine0;
    this.onSortingCriteriaChanged.emit([<SortingCriteria>{columnType: colType, ascending: ascending}]);
  }

  private getSortStatus(columnType: ColumnType): SortStatus {
    return this._sortingCriteria[0].columnType === columnType
      ? this._sortingCriteria[0].ascending
        ? SortStatus.ascending
        : SortStatus.descending
      : SortStatus.inactive;
  }

  private columnWidth(): string {
    return this.showOpportunities ? 'col-16-pct' : 'col-20-pct';
  }

  private centerColumnsWidth(): string {
    return this.showOpportunities ? 'col-50-pct' : 'col-60-pct';
  }
}
