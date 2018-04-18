import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CalculatorService } from '../../../services/calculator.service';
import { CssClasses } from '../../../models/css-classes.model';
import { LoadingState } from '../../../enums/loading-state.enum';
import { ListOpportunitiesColumnType } from '../../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableRow } from '../../../models/list-opportunities/list-opportunities-table-row.model';
import { RowType } from '../../../enums/row-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'list-opportunities-table',
  template: require('./list-opportunities-table.component.pug'),
  styles: [ require('./list-opportunities-table.component.scss') ]
})
export class ListOpportunitiesTableComponent implements OnInit, OnChanges  {
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: ListOpportunitiesTableRow}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();

  @Input()
  set sortingCriteria(criteria: Array<SortingCriteria>) {
    this.applySortingCriteria(criteria);
  }

  @Input()
  set tableData(tableData: Array<ListOpportunitiesTableRow>) {
    if (tableData) {
      const sortedTableData: Array<ListOpportunitiesTableRow> = typeof this.sortingFunction === 'function'
        ? tableData.sort(this.sortingFunction)
        : tableData;
      this.sortedTableData = sortedTableData;
    }
  }

  @Input() performanceMetric: string;
  @Input() tableHeaderRow: Array<string>;
  @Input() loadingState: LoadingState.Loaded;

  public sortedTableData: Array<ListOpportunitiesTableRow>;
  public columnType = ListOpportunitiesColumnType;
  public rowType = RowType;
  public loadingStateEnum = LoadingState;
  public tableClasses: CssClasses = {};
  public isSelectAllChecked = false;
  public isIndeterminateChecked = false;

  private sortingFunction: (elem0: ListOpportunitiesTableRow, elem1: ListOpportunitiesTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = [{
    columnType: ListOpportunitiesColumnType.cytdColumn,
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

  public onCheckboxChange(row: ListOpportunitiesTableRow) {
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
    return 'total-row-absent';
  }

  public getSortStatus(columnType: ListOpportunitiesColumnType): SortStatus {
    return this._sortingCriteria[0].columnType === columnType
      ? this._sortingCriteria[0].ascending
        ? SortStatus.ascending
        : SortStatus.descending
      : SortStatus.inactive;
  }

  public sortRows(colType: ListOpportunitiesColumnType) {
    const ascending = this._sortingCriteria[0].columnType === colType
      ? !this._sortingCriteria[0].ascending
      : colType === ListOpportunitiesColumnType.storeColumn;
    const criteria = [<SortingCriteria>{columnType: colType, ascending: ascending}];
    this.applySortingCriteria(criteria);
  }

  public onRowClicked(type: RowType, index: number, row?: ListOpportunitiesTableRow) {
    this.onElementClicked.emit({type: type, index: index, row: row});
  }

  public toggleSelectAllStores(event: MatCheckboxChange) {
    this.isSelectAllChecked = event.checked;
    this.sortedTableData.forEach((row: ListOpportunitiesTableRow) => {
      return row.checked = this.isSelectAllChecked;
    });
  }

  public getSubHeaderClasses(): string {
    return '';
  }

  public getEntityRowClasses(row: ListOpportunitiesTableRow): CssClasses {
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
      this.sortingFunction = (elem0: ListOpportunitiesTableRow, elem1: ListOpportunitiesTableRow) => {
        let i: number = 0;
        let currentColumn: string;
        let currentSortOrder: number;
        this._sortingCriteria.every((criterion, idx) => {
          i = idx;
          currentColumn = ListOpportunitiesColumnType[criterion.columnType];
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
      const sortedData: Array<ListOpportunitiesTableRow> = this.sortedTableData.sort(this.sortingFunction);
      this.sortedTableData = sortedData;
    }
  }
}
