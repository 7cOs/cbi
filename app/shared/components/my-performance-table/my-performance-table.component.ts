// tslint:disable:no-unused-variable
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ColumnType } from '../../../enums/column-type.enum';
import { DateRange } from '../../../models/date-range.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';

@Component({
  selector: 'my-performance-table',
  template: require('./my-performance-table.component.pug'),
  styles: [ require('./my-performance-table.component.scss') ]
})
export class MyPerformanceTableComponent {
  @Output() onElementClicked = new EventEmitter<MyPerformanceTableEvent>();
  @Output() onSortingCriteriasChanged = new EventEmitter<Array<SortingCriteria>>();

  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() performanceMetric: string;
  @Input() dateRange: DateRange;

  @Input()
  set sortingCriterias(criterias: Array<SortingCriteria>) {
    this._sortingCriterias = criterias;
    this.updateSortingFunction();
    this._tableData = this._tableData.sort(this.sortingFunction);
  }

  @Input()
  set tableData(tableData: Array<MyPerformanceTableRow>) {
    console.log('thing', tableData);
    this._tableData = tableData;

    if (typeof this.sortingFunction === 'function') {
      this._tableData = this._tableData.sort(this.sortingFunction);
    }
  }

  private sortingFunction: (left: MyPerformanceTableRow, right: MyPerformanceTableRow) => number;
  private _sortingCriterias: Array<SortingCriteria> = null;
  private _tableData: Array<MyPerformanceTableRow>;

  private updateSortingFunction() {
    if (this._sortingCriterias.length) {
      this.sortingFunction = (left: MyPerformanceTableRow, right: MyPerformanceTableRow) => {
        let i = 0;
        let currentColumn;
        let currentSortOrder;
        do {
          currentColumn = ColumnType[this._sortingCriterias[i].columnType];
          currentSortOrder = this.compareObjects(left[currentColumn], (right[currentColumn]));
          i++;
        } while (i < this._sortingCriterias.length && currentSortOrder === 0);
        console.log(currentSortOrder);
        return this._sortingCriterias[--i].order ? currentSortOrder : -currentSortOrder;
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

  private sortRows(colType: ColumnType, order: boolean) {
    console.log('sort');
    this._sortingCriterias = [<SortingCriteria>{columnType: colType, order: order}];
    this.updateSortingFunction();
  }

}

export interface MyPerformanceTableEvent {
  row: MyPerformanceTableRow;
  index: number;
}

export interface SortingCriteria {
  columnType: ColumnType;
  order: boolean;
}
