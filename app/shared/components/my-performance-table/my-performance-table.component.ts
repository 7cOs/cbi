import { Component, Input, Output, EventEmitter } from '@angular/core';

export enum ColumnType {
  descriptionLine0,
  descriptionLine1,
  metricColumn0,
  metricColumn1,
  metricColumn2,
  ctv
}

@Component({
  selector: 'my-performance-table',
  template: require('./my-performance-table.component.pug'),
  styles: [ require('./my-performance-table.component.scss') ]
})

export class MyPerformanceTableComponent {
  @Output() onElementClicked = new EventEmitter<MyPerformanceTableEvent>();
  @Output() onSortingCriteriasChanged = new EventEmitter<Array<SortingCriteria>>();

  @Input()
  set sortingCriteria(criterias: Array<SortingCriteria>) {
    this._sortingCriteria = criterias;
    this.updateSortingFunction();
    this._tableData = this._tableData.sort(this.sortingFunction);
  }

  @Input() tableHeaderRow: Array<string>;

  @Input() totalRow: MyPerformanceTableRow;

  @Input()
  set tableDataRow(tableData: Array<MyPerformanceTableRow>) {
    this._tableData = tableData;

    if (typeof this.sortingFunction === 'function') { // check if that works
      this._tableData = this._tableData.sort(this.sortingFunction);
    }
  }

  private sortingFunction: (left: MyPerformanceTableRow, right: MyPerformanceTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = null;
  private _tableData: Array<MyPerformanceTableRow> = [];

  private updateSortingFunction() {
    if (this._sortingCriteria.length) {
      this.sortingFunction = (left: MyPerformanceTableRow, right: MyPerformanceTableRow) => {
        let i = 0;
        let currentColumn;
        let currentSortOrder;
        do {
          currentColumn = ColumnType[this._sortingCriteria[i].columnType];
          currentSortOrder = this.compareObjects(left[currentColumn], (right[currentColumn]));
          i++;
        } while (i < this._sortingCriteria.length && currentSortOrder === 0);

        return this._sortingCriteria[--i].order ? currentSortOrder : -currentSortOrder;
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

  // private clickOn(row: MyPerformanceTableRow, index: number) {
  //   this.onElementClicked.emit({row: row, index: index});
  // }

}

export interface MyPerformanceTableRow {
  descriptionLine0: string;
  descriptionLine1: string;
  metricColumn0: number;
  metricColumn1: number;
  metricColumn2: number;
  ctv: number;
}

export interface MyPerformanceTableEvent {
  row: MyPerformanceTableRow;
  index: number;
}

export interface SortingCriteria {
  columnType: ColumnType;
  order: boolean;
}
