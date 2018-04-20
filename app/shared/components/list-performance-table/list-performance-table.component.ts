import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CalculatorService } from '../../../services/calculator.service';
import { CssClasses } from '../../../models/css-classes.model';
import { LoadingState } from '../../../enums/loading-state.enum';
import { ListPerformanceColumnType } from '../../../enums/list-performance-column-types.enum';
import { ListPerformanceTableRow } from '../../../models/list-performance/list-performance-table-row.model';
import { RowType } from '../../../enums/row-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'list-performance-table',
  template: require('./list-performance-table.component.pug'),
  styles: [ require('./list-performance-table.component.scss') ]
})
export class ListPerformanceTableComponent implements OnInit, OnChanges  {
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: ListPerformanceTableRow}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();

  @Input()
  set sortingCriteria(criteria: Array<SortingCriteria>) {
    this.applySortingCriteria(criteria);
  }

  @Input()
  set tableData(tableData: Array<ListPerformanceTableRow>) {
    if (tableData) {
      const sortedTableData: Array<ListPerformanceTableRow> = typeof this.sortingFunction === 'function'
        ? tableData.sort(this.sortingFunction)
        : tableData;
        this.sortedTableData = sortedTableData;
        this.numSelectedRows = this.sortedTableData.length;
    }
  }

  @Input() performanceMetric: string;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: ListPerformanceTableRow;
  @Input() loadingState: LoadingState.Loaded;

  public sortedTableData: Array<ListPerformanceTableRow>;
  public numSelectedRows: number = 0;
  public columnType = ListPerformanceColumnType;
  public rowType = RowType;
  public loadingStateEnum = LoadingState;
  public tableClasses: CssClasses = {};
  public isSelectAllChecked = false;
  public isIndeterminateChecked = false;

  private sortingFunction: (elem0: ListPerformanceTableRow, elem1: ListPerformanceTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = [{
    columnType: ListPerformanceColumnType.cytdColumn,
    ascending: false
  }];

  constructor (private calculatorService: CalculatorService) { }

  public ngOnInit() {
    this.tableClasses = this.getTableClasses(this.loadingState);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const loadingState = changes.loadingState ? changes.loadingState.currentValue : this.loadingState;
    this.tableClasses = this.getTableClasses(loadingState);
  }

  public onCheckboxChange(row: ListPerformanceTableRow): void {
    const checkedTrue = this.sortedTableData.filter( function(tableRow) {
      return tableRow.checked === true;
    });
    const numCheckedTrue = checkedTrue.length;
    const numCheckedFalse = this.sortedTableData.length - numCheckedTrue;
    this.setCheckboxStates(numCheckedFalse, numCheckedTrue);
  }

  public setCheckboxStates(checkedFalseCount: number, checkedTrueCount: number) {
    if (this.isSelectAllChecked === false && checkedFalseCount !== this.sortedTableData.length) {
      this.isSelectAllChecked = true;
      this.isIndeterminateChecked = false;
    }
    if (this.isSelectAllChecked === true && checkedTrueCount !== this.sortedTableData.length) {
      this.isSelectAllChecked = false;
      this.isIndeterminateChecked = true;
    }
    if ( this.isIndeterminateChecked === true && checkedFalseCount === this.sortedTableData.length ) {
      this.isIndeterminateChecked = false;
      this.isSelectAllChecked = false;
    }
  }

  public getTableBodyClasses(): string {
    return (this.totalRow) ? 'total-row-present' : 'total-row-absent';
  }

  public getSortStatus(columnType: ListPerformanceColumnType): SortStatus {
    return this._sortingCriteria[0].columnType === columnType
      ? this._sortingCriteria[0].ascending
        ? SortStatus.ascending
        : SortStatus.descending
      : SortStatus.inactive;
  }

  public sortRows(colType: ListPerformanceColumnType) {
    const ascending = this._sortingCriteria[0].columnType === colType
      ? !this._sortingCriteria[0].ascending
      : colType === ListPerformanceColumnType.storeColumn;
    const criteria = [<SortingCriteria>{columnType: colType, ascending: ascending}];
    this.applySortingCriteria(criteria);
  }

  public onRowClicked(type: RowType, index: number, row?: ListPerformanceTableRow) {
      this.onElementClicked.emit({type: type, index: index, row: row});
  }

  public toggleSelectAllStores(event: MatCheckboxChange): void {
    this.isSelectAllChecked = event.checked;
    this.numSelectedRows = this.isSelectAllChecked ? this.sortedTableData.length : 0;
    for (let i = 0; i < this.sortedTableData.length; i++) {
      this.sortedTableData[i].checked = this.isSelectAllChecked;
    }
  }

  public getSubHeaderClasses(): string {
    return this.totalRow ? ' no-sub-header-border' : '';
  }

  public getEntityRowClasses(row: ListPerformanceTableRow): CssClasses {
    let classes: CssClasses = {
      'performance-error': row.performanceError,
      'selected-entity-row': row.checked
    };
    return classes;
  }

  private getTableClasses(loadingState: LoadingState): CssClasses {
    return {
      [loadingState]: true
    };
  }

  private updateSortingFunction() {
    if (this._sortingCriteria.length) {
      this.sortingFunction = (elem0: ListPerformanceTableRow, elem1: ListPerformanceTableRow) => {
        let i: number = 0;
        let currentColumn: string;
        let currentSortOrder: number;
        this._sortingCriteria.every((criterion, idx) => {
          i = idx;
          currentColumn = ListPerformanceColumnType[criterion.columnType];
          currentSortOrder = this.calculatorService.compareObjects(elem0[currentColumn], (elem1[currentColumn]));
          return !currentSortOrder;
        });
        return this._sortingCriteria[i].ascending ? currentSortOrder : 0 - currentSortOrder;
      };
    }
  }

  private applySortingCriteria(criteria: SortingCriteria[]) {
    this._sortingCriteria = criteria;
    this.updateSortingFunction();
    if (this.sortedTableData && this.sortedTableData.length) {
      const sortedData: Array<ListPerformanceTableRow> = this.sortedTableData.sort(this.sortingFunction);
      this.sortedTableData = sortedData;
    }
  }
}
