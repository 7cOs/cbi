import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { sortBy } from 'lodash';

import { CalculatorService } from '../../../services/calculator.service';
import { MyPerformanceColumnType } from '../../../enums/my-performance-column-type.enum';
import { CssClasses } from '../../../models/css-classes.model';
import { DateRange } from '../../../models/date-range.model';
import { EntityPeopleType } from '../../../enums/entity-responsibilities.enum';
import { LoadingState } from '../../../enums/loading-state.enum';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { RowType } from '../../../enums/row-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { SortWeight, GEOGRAPHY_SORTING_WEIGHT, specializedRoleGroupWeights } from '../../../models/sort-weight.model';

@Component({
  selector: 'my-performance-table',
  template: require('./my-performance-table.component.pug'),
  styles: [ require('./my-performance-table.component.scss') ]
})
export class MyPerformanceTableComponent implements OnInit, OnChanges {
  @Output() onDismissibleRowXClicked = new EventEmitter<Event>();
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: MyPerformanceTableRow}>();
  @Output() onOpportunityCountClicked = new EventEmitter<MyPerformanceTableRow>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();
  @Output() onSublineClicked = new EventEmitter<MyPerformanceTableRow>();

  @Input()
  set sortingCriteria(criteria: Array<SortingCriteria>) {
    this.applySortingCriteria(criteria);
  }

  @Input()
  set tableData(tableData: Array<MyPerformanceTableRow>) {
    if (tableData) {
      let sortedTableData: Array<MyPerformanceTableRow> = typeof this.sortingFunction === 'function'
        ? tableData.sort(this.sortingFunction)
        : tableData;

      this.sortedTableData = this.sortRoleGroups(sortedTableData);
    }
  }

  @Input() dateRange: DateRange;
  @Input() performanceMetric: string;
  @Input() showDateRange: boolean = false;
  @Input() showOpportunities: boolean = false;
  @Input() opportunitiesError: boolean = false;
  @Input() showContributionToVolume: boolean = false;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() dismissibleTotalRow: MyPerformanceTableRow;
  @Input() viewType: SalesHierarchyViewType | ProductMetricsViewType;
  @Input() selectedSkuPackageCode: string;
  @Input() selectedSubaccountCode: string;
  @Input() selectedDistributorCode: string;
  @Input() selectedStoreId: string;
  @Input() loadingState: LoadingState;

  public sortedTableData: Array<MyPerformanceTableRow>;
  public columnType = MyPerformanceColumnType;
  public rowType = RowType;
  public loadingStateEnum = LoadingState;
  public rippleColor: string = 'rgba(17, 119, 184, 0.05)';
  public tableClasses: CssClasses = {};

  private sortingFunction: (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = null;

  constructor (private calculatorService: CalculatorService) { }

  public ngOnInit() {
    this.tableClasses = this.getTableClasses(this.viewType, this.loadingState);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const viewType = changes.viewType ? changes.viewType.currentValue : this.viewType;
    const loadingState = changes.loadingState ? changes.loadingState.currentValue : this.loadingState;
    this.tableClasses = this.getTableClasses(viewType, loadingState);
  }

  public getTableBodyClasses(): string {
    return (this.totalRow || this.dismissibleTotalRow) ? 'total-row-present' : 'total-row-absent';
  }

  public getSortStatus(columnType: MyPerformanceColumnType): SortStatus {
    return this._sortingCriteria[0].columnType === columnType
      ? this._sortingCriteria[0].ascending
        ? SortStatus.ascending
        : SortStatus.descending
      : SortStatus.inactive;
  }

  public sortRows(colType: MyPerformanceColumnType) {
    // this will only sort on the FIRST criterion (for now)
    const ascending = this._sortingCriteria[0].columnType === colType
      ? !this._sortingCriteria[0].ascending
      : colType === MyPerformanceColumnType.descriptionRow0;
    const criteria = [<SortingCriteria>{columnType: colType, ascending: ascending}];
    this.applySortingCriteria(criteria);
  }

  public onRowClicked(type: RowType, index: number, row?: MyPerformanceTableRow) {
      this.onElementClicked.emit({type: type, index: index, row: row});
  }

  public getTotalRowClasses() {
    let classes: CssClasses = {
      'deselected-total-row': !!((this.viewType === SalesHierarchyViewType.subAccounts ||
        this.viewType === SalesHierarchyViewType.distributors) && (this.selectedSubaccountCode || this.selectedDistributorCode))
    };

    const columnWidthClass = this.getColumnWidthClass();
    if (columnWidthClass) {
      classes[columnWidthClass] = true;
    }

    return classes;
  }

  public getColumnWidthClass(): string {
    let style = '';

    if (this.showContributionToVolume && this.showOpportunities) {
      style = 'two-right-columns-present';
    } else if (this.showContributionToVolume || this.showOpportunities) {
      style = 'one-right-column-present';
    }

    return style;
  }

  public getSubHeaderClasses(): string {
    let style = '';

    if (this.showContributionToVolume && this.showOpportunities) {
      style = 'two-right-columns-present';
    } else if (this.showContributionToVolume || this.showOpportunities) {
      style = 'one-right-column-present';
    }

    if (this.totalRow) {
      style = style.concat(' no-sub-header-border');
    }

    return style;
  }

  public getEntityRowClasses(row: MyPerformanceTableRow): CssClasses {
    let classes: CssClasses = {
      'performance-error': row.performanceError,
      'selected-sku': !!(this.selectedSkuPackageCode && row.metadata.skuPackageCode === this.selectedSkuPackageCode),
      'selected-entity-row': this.isSingleSelectRow(row)
    };

    const columnWidthClass = this.getColumnWidthClass();
    if (columnWidthClass) {
      classes[columnWidthClass] = true;
    }

    return classes;
  }

  public getDismissibleTotalRowClasses(): CssClasses {
    let classes: CssClasses = {
      'selected': (!this.selectedSkuPackageCode && this.dismissibleTotalRow) ? true : false
    };

    const columnWidthClass = this.getColumnWidthClass();
    if (columnWidthClass) {
      classes[columnWidthClass] = true;
    }

    return classes;
  }

  private getTableClasses(viewType: SalesHierarchyViewType | ProductMetricsViewType, loadingState: LoadingState): CssClasses {
    return {
      [`view-type-${viewType}`]: true,
      [loadingState]: true
    };
  }

  private updateSortingFunction() {
    if (this._sortingCriteria.length) {
      this.sortingFunction = (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => {
        let i: number = 0;
        let currentColumn: string;
        let currentSortOrder: number;
        this._sortingCriteria.every((criterion, idx) => {
          i = idx;
          currentColumn = MyPerformanceColumnType[criterion.columnType];
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
      const sortedData: Array<MyPerformanceTableRow> = this.sortedTableData.sort(this.sortingFunction);
      this.sortedTableData = this.sortRoleGroups(sortedData);
    }
  }

  private sortRoleGroups(rowData: Array<MyPerformanceTableRow>): Array<MyPerformanceTableRow> {
    const rowDataMapping: Array<SortWeight> = rowData.map((row: MyPerformanceTableRow, index: number) => {
      return {
        index: index,
        sortWeight: row.descriptionRow0 === EntityPeopleType.GEOGRAPHY
          ? GEOGRAPHY_SORTING_WEIGHT
          : specializedRoleGroupWeights[row.metadata.entityTypeCode] || index
      };
    });
    const sortedRowDataMapping: Array<SortWeight> = sortBy(rowDataMapping, ['sortWeight']);
    return sortedRowDataMapping.map((row: SortWeight) => {
      return rowData[row.index];
    });
  }

  private isSingleSelectRow(row: MyPerformanceTableRow): boolean {
    return !!((
      this.selectedSubaccountCode
      || this.selectedDistributorCode
      || this.selectedStoreId
    ) && (
      row.metadata.positionId === this.selectedSubaccountCode
      || row.metadata.positionId === this.selectedDistributorCode
      || row.metadata.positionId === this.selectedStoreId
    ));
  }
}
