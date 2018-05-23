import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { CalculatorService } from '../../../services/calculator.service';
import { CssClasses } from '../../../models/css-classes.model';
import { LoadingState } from '../../../enums/loading-state.enum';
import { ListOpportunitiesColumnType } from '../../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableRow } from '../../../models/list-opportunities/list-opportunities-table-row.model';
import { ListTableDrawerRow } from '../../../models/lists/list-table-drawer-row.model';
import { LIST_TABLE_SIZE } from '../lists-pagination/lists-pagination.component';
import { MatCheckboxChange } from '@angular/material';
import { OpportunityStatus } from '../../../enums/list-opportunities/list-opportunity-status.enum';
import { PageChangeData } from '../../../containers/lists/list-detail.component';
import { RowType } from '../../../enums/row-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export interface OpportunitiesTableSelectAllCheckboxState {
  isSelectAllChecked: boolean;
  isIndeterminateChecked: boolean;
}

@Component({
  selector: 'list-opportunities-table',
  template: require('./list-opportunities-table.component.pug'),
  styles: [ require('./list-opportunities-table.component.scss') ]
})
export class ListOpportunitiesTableComponent implements OnInit, OnChanges, OnDestroy  {
  @Input() sortReset: Subject<Event>;
  @Input() paginationReset: Subject<Event>;
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: ListOpportunitiesTableRow}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();
  @Output() onPaginationReset = new EventEmitter<any>();
  @Output() onRowChecked = new EventEmitter<number>();
  @Output() onSelectAllChecked = new EventEmitter<boolean>();

  @Input()
  set sortingCriteria(criteria: Array<SortingCriteria>) {
    this.defaultSortCriteria = criteria;
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
      this.numberOfRows = this.sortedTableData.length;
      this.numSelectedRows = this.sortedTableData.length;
      this.numExpandedRows = 0;
      this.isExpandAll = false;
      this.isSelectAllChecked = false;
      this.isIndeterminateChecked = false;
      this.isOpportunityTableExtended = false;
    }
  }

  @Input()
  set pageChangeData(pageChangeData: PageChangeData) {
    if (pageChangeData) {
      this.handlePageChangeClicked(pageChangeData);
    }
    this.isOpportunityTableExtended = false;
  }

  @Input() performanceMetric: string;
  @Input() tableHeaderRow: Array<string>;
  @Input() loadingState: LoadingState.Loaded;
  @Input() oppStatusSelected: OpportunityStatus;

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
  public storeNameSelected: string;
  public opportunitySelected: string;
  public unversionedStoreId: string;
  public isExpandAll: boolean = false;
  public opportunitiesTableData: Array<ListOpportunitiesTableRow>;

  private isOpportunityTableExtended: boolean = false;
  private defaultSortCriteria: Array<SortingCriteria>;
  private numberOfRows: number = 0;
  private numExpandedRows: number = 0;
  private sortingFunction: (elem0: ListOpportunitiesTableRow, elem1: ListOpportunitiesTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = [{
    columnType: ListOpportunitiesColumnType.cytdColumn,
    ascending: false
  }];

  private sortResetSubscription: Subscription;
  private paginationResetSubscription: Subscription;

  constructor (private calculatorService: CalculatorService) { }

  public ngOnInit() {
    this.tableClasses = this.getTableClasses(this.loadingState);
    this.sortResetSubscription = this.sortReset.subscribe(() => {
      this.applySortingCriteria(this.defaultSortCriteria);
    });
    this.paginationResetSubscription = this.paginationReset.subscribe(() => {
      this.isSelectAllChecked = false;
      this.isIndeterminateChecked = false;
      if (this.sortedTableData) {
        this.sortedTableData.forEach((row) => {
          row.checked = this.isSelectAllChecked;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.sortResetSubscription) {
      this.sortResetSubscription.unsubscribe();
    }
    if (this.paginationResetSubscription) {
      this.paginationResetSubscription.unsubscribe();
    }
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

    row.opportunities.forEach((opportunityRow: ListTableDrawerRow) => {
      opportunityRow.checked = row.checked;
    });
    this.onRowChecked.emit(numCheckedTrue);
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

      this.sortedTableData[i].opportunities.forEach((opportunityRow: ListTableDrawerRow) => {
        opportunityRow.checked = this.isSelectAllChecked;
      });
    }
    this.onSelectAllChecked.emit(event.checked);
  }

  public getEntityRowClasses(row: ListOpportunitiesTableRow): CssClasses {
    let classes: CssClasses = {
      'performance-error': row.performanceError,
      'selected-entity-row': row.checked
    };
    return classes;
  }

  public toggleOpportunityTable(): void {
    this.isOpportunityTableExtended = !this.isOpportunityTableExtended;
  }

  public onOpportunityTypeClicked(opportunityId: string, storeColumn: string, unversionedStoreId: string): void {
    this.storeNameSelected = storeColumn;
    this.opportunitySelected = opportunityId;
    this.unversionedStoreId = unversionedStoreId;
    this.isOpportunityTableExtended = true;
  }

  public onTableRowClicked(row: ListOpportunitiesTableRow): void {
    row.expanded = !row.expanded;
    row.expanded ? this.numExpandedRows++ : this.numExpandedRows--;
    if (this.numExpandedRows === this.numberOfRows) this.isExpandAll = true;
    else if (this.numExpandedRows === 0) this.isExpandAll = false;
  }

  public onExpandAllClicked(): void {
    this.isExpandAll = !this.isExpandAll;
    this.isExpandAll ? this.numExpandedRows = this.numberOfRows : this.numExpandedRows = 0;

    if (this.sortedTableData) {
      this.sortedTableData.forEach((row: ListOpportunitiesTableRow) => {
        row.expanded = this.isExpandAll;
      });
    }
  }

  public onOpportunityCheckboxClicked(storeRow: ListOpportunitiesTableRow): void {
    storeRow.checked = storeRow.opportunities.reduce((isEveryOppChecked: boolean, opportunityRow: ListTableDrawerRow) => {
      if (!opportunityRow.checked) isEveryOppChecked = false;
      return isEveryOppChecked;
    }, true);

    const checkedOpps = this.opportunitiesTableData.reduce((totalOpps, store) => {
      store.opportunities.forEach((opp) => {
      if (opp.checked === true) totalOpps.push(opp);
      });
      return totalOpps;
    }, []);

    const selectedAllCheckboxState: OpportunitiesTableSelectAllCheckboxState = this.getSelectAllCheckboxState(this.sortedTableData);

    this.isSelectAllChecked = selectedAllCheckboxState.isSelectAllChecked;
    this.isIndeterminateChecked = selectedAllCheckboxState.isIndeterminateChecked;
    this.onRowChecked.emit(checkedOpps.length);
  }

  public isOppsTableDataEmpty(): boolean {
    return this.sortedTableData && !this.sortedTableData.length;
  }

  private getSelectAllCheckboxState(tableData: ListOpportunitiesTableRow[]): OpportunitiesTableSelectAllCheckboxState {
    const selectAllCheckboxState: OpportunitiesTableSelectAllCheckboxState = tableData.reduce(
      (selectAllState: OpportunitiesTableSelectAllCheckboxState, tableRow: ListOpportunitiesTableRow) => {
        if (tableRow.checked) selectAllState.isIndeterminateChecked = true;
        else selectAllState.isSelectAllChecked = false;

        return selectAllState;
      }, {
        isSelectAllChecked: true,
        isIndeterminateChecked: false
      });

    if (selectAllCheckboxState.isSelectAllChecked) selectAllCheckboxState.isIndeterminateChecked = false;

    return selectAllCheckboxState;
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
    this.onPaginationReset.emit();
  }
}
