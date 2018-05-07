import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CalculatorService } from '../../../services/calculator.service';
import { CssClasses } from '../../../models/css-classes.model';
import { LoadingState } from '../../../enums/loading-state.enum';
import { ListOpportunitiesColumnType } from '../../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableRow } from '../../../models/list-opportunities/list-opportunities-table-row.model';
import { MatCheckboxChange } from '@angular/material';
import { RowType } from '../../../enums/row-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { LIST_TABLE_SIZE } from '../lists-pagination/lists-pagination.component';
import { PageChangeData } from '../../../containers/lists/list-detail.component';

@Component({
  selector: 'list-opportunities-table',
  template: require('./list-opportunities-table.component.pug'),
  styles: [ require('./list-opportunities-table.component.scss') ]
})
export class ListOpportunitiesTableComponent implements OnInit, OnChanges  {
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: ListOpportunitiesTableRow}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();
  @Output() sortClick: EventEmitter<{}> = new EventEmitter<any>();

  @Input()
  set sortingCriteria(criteria: Array<SortingCriteria>) {
    this.applySortingCriteria(criteria);
  }

  @Input()
  set tableData(tableData: Array<ListOpportunitiesTableRow>) {
    this.opportunitiesTableData = tableData;
    if (tableData) {
      const sortedTableData: Array<ListOpportunitiesTableRow> = typeof this.sortingFunction === 'function'
        ? tableData.sort(this.sortingFunction)
        : tableData;
      this.sortedTableData = sortedTableData;
      this.numSelectedRows = this.sortedTableData.length;
    }
  }

  @Input()
  set pageChangeData(pageChangeData: PageChangeData) {
    if (pageChangeData) {
      this.handlePageChangeClicked(pageChangeData);
    }
  }

  @Input() performanceMetric: string;
  @Input() tableHeaderRow: Array<string>;
  @Input() loadingState: LoadingState.Loaded;

  public sortedTableData: Array<ListOpportunitiesTableRow>;
  public numSelectedRows: number = 0;
  public columnType = ListOpportunitiesColumnType;
  public rowType = RowType;
  public loadingStateEnum = LoadingState;
  public sliceStart: number = 0;
  public sliceEnd: number = LIST_TABLE_SIZE;
  public tableClasses: CssClasses = {};
  public isSelectAllChecked = false;
  public isIndeterminateChecked = false;
  public opportunitiesTableData: Array<ListOpportunitiesTableRow>;

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

  public handlePageChangeClicked(data: PageChangeData) {
    if (this.opportunitiesTableData) {
      this.sliceStart = data.pageStart;
      this.sliceEnd = data.pageEnd;
    }
  }

  public onCheckboxChange(row: ListOpportunitiesTableRow): void {
    const checkedTrue = this.sortedTableData.filter(tableRow => tableRow.checked === true);
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

  public toggleSelectAllStores(event: MatCheckboxChange): void {
    this.isSelectAllChecked = event.checked;
    this.numSelectedRows = this.isSelectAllChecked ? this.sortedTableData.length : 0;
    for (let i = 0; i < this.sortedTableData.length; i++) {
      this.sortedTableData[i].checked = this.isSelectAllChecked;
    }
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
    this.sortClick.emit();
  }
}
