// tslint:disable:no-unused-variable
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DateRange } from '../../../models/date-range.model';

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
  set tableDataRow(tableData: Array<MyPerformanceTableRow>) {
    this._tableData = tableData;

    if (typeof this.sortingFunction === 'function') { // check if that works
      this._tableData = this._tableData.sort(this.sortingFunction);
    }
  }

  // stubbing this here for now
  private _tableHeaderRow: string[] = ['People', 'Depletions', 'CTV'];
  private _performanceMetric: string = 'Depletions';
  private _dateRange: DateRange = <DateRange>{displayCode: 'CYTD', code: 'CYTDBDL', range: '01/01/17 - 06/27/17'};
  private row1Data: MyPerformanceTableRow = {
    descriptionLine0: 'Specialists',
    descriptionLine1: '',
    metricColumn0: 123,
    metricColumn1: 456,
    metricColumn2: 789,
    ctv: 44
  };
  private row2Data: MyPerformanceTableRow = {
    descriptionLine0: 'MDMs',
    descriptionLine1: '',
    metricColumn0: 11,
    metricColumn1: 46,
    metricColumn2: 78,
    ctv: 4
  };

  private totalRowData: MyPerformanceTableRow = {
    descriptionLine0: 'Total',
    descriptionLine1: '',
    metricColumn0: 1323,
    metricColumn1: 4356,
    metricColumn2: 89,
    ctv: 100
  };

  private sortingFunction: (left: MyPerformanceTableRow, right: MyPerformanceTableRow) => number;
  private _sortingCriterias: Array<SortingCriteria> = null;
  private _tableData: Array<MyPerformanceTableRow> = [ this.row1Data, this.row2Data ];

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
