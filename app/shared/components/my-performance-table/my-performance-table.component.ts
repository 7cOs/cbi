import { Component, Input, Output, EventEmitter } from '@angular/core';

export enum ColumnType {
  description,
  metricColumn1,
  metricColumn2,
  metricColumn3,
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
  set sortingCriterias(criterias: Array<SortingCriteria>) {
    this._sortingCriterias = criterias;
    this.updateSortingFunction();
    this._tableData = this._tableData.sort(this.sortingFunction);
  }

  @Input()
  set tableData(tableData: Array<MyPerformanceTableRow>) {
    this._tableData = tableData;

    if (typeof this.sortingFunction === 'function') { // check if that works
      this._tableData = this._tableData.sort(this.sortingFunction);
    }
  }

  private sortingFunction: (left: MyPerformanceTableRow, right: MyPerformanceTableRow) => number;
  private _sortingCriterias: Array<SortingCriteria> = null;
  private _tableData: Array<MyPerformanceTableRow> = [];

  updateSortingFunction() {
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

        return this._sortingCriterias[--i].order ? currentSortOrder : -currentSortOrder;
      };
    }
  }

  compareObjects(a: any, b: any) {
    return a < b
      ? -1
      : a > b
        ? 1
        : 0;
  }

  clickOn(row: MyPerformanceTableRow, index: number) {
    this.onElementClicked.emit({row: row, index: index});
  }

}

export interface MyPerformanceTableRow {
  description: {
    line0: string;
    line1: string;
  };
  metricColumn1: number;
  metricColumn2: number;
  metricColumn3: number;
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
