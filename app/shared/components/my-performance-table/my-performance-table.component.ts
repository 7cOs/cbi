import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CalculatorService } from '../../../services/calculator.service';
import { ColumnType } from '../../../enums/column-type.enum';
import { CssClasses } from '../../../models/css-classes.model';
import { DateRange } from '../../../models/date-range.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { RowType } from '../../../enums/row-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';

@Component({
  selector: 'my-performance-table',
  template: require('./my-performance-table.component.pug'),
  styles: [ require('./my-performance-table.component.scss') ]
})
export class MyPerformanceTableComponent {
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: MyPerformanceTableRow}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();
  @Output() onSublineClicked = new EventEmitter<MyPerformanceTableRow>();
  @Output() onDismissableRowXClicked = new EventEmitter<any>();

  @Input()
  set sortingCriteria(criteria: Array<SortingCriteria>) {
    this.applySortingCriteria(criteria);
  }

  @Input()
  set tableData(tableData: Array<MyPerformanceTableRow>) {
    if (tableData) {
      this.sortedTableData = typeof this.sortingFunction === 'function'
        ? tableData.sort(this.sortingFunction)
        : tableData;
    }
  }

  @Input() dateRange: DateRange;
  @Input() performanceMetric: string;
  @Input() showDateRange: boolean = false;
  @Input() showOpportunities: boolean = false;
  @Input() showContributionToVolume: boolean = false;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() dismissableTotalRow: MyPerformanceTableRow;
  @Input() viewType: SalesHierarchyViewType | ProductMetricsViewType;
  @Input() selectedSkuPackageCode: string;
  @Input() selectedSubaccountCode: string;
  @Input() selectedDistributorCode: string;

  public sortedTableData: Array<MyPerformanceTableRow>;
  public columnType = ColumnType;
  public rowType = RowType;

  private sortingFunction: (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = null;
  private rippleEffect: boolean = false;

  constructor (private calculatorService: CalculatorService) { }

  public getTableHeightClass(): string {
    return (this.totalRow || this.dismissableTotalRow) ? 'total-row-present' : 'total-row-absent';
  }

  public getSortStatus(columnType: ColumnType): SortStatus {
    return this._sortingCriteria[0].columnType === columnType
      ? this._sortingCriteria[0].ascending
        ? SortStatus.ascending
        : SortStatus.descending
      : SortStatus.inactive;
  }

  public sortRows(colType: ColumnType) {
    // this will only sort on the FIRST criterion (for now)
    const ascending = this._sortingCriteria[0].columnType === colType
      ? !this._sortingCriteria[0].ascending
      : colType === ColumnType.descriptionRow0;
    const criteria = [<SortingCriteria>{columnType: colType, ascending: ascending}];
    this.applySortingCriteria(criteria);
  }

  public onRowClicked(type: RowType, index: number, row?: MyPerformanceTableRow) {
      this.rippleEffect = true;
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

  public getEntityRowClasses(row: MyPerformanceTableRow): CssClasses {
    let classes: CssClasses = {
      'performance-error': row.performanceError,
      'ripple-effect': this.rippleEffect && !!((this.selectedSubaccountCode || this.selectedDistributorCode)
        && (row.metadata.positionId === this.selectedSubaccountCode || row.metadata.positionId === this.selectedDistributorCode)),
      'selected-sku': !!(this.selectedSkuPackageCode && row.metadata.skuPackageCode === this.selectedSkuPackageCode),
      'selected-entity-row': !!((this.selectedSubaccountCode || this.selectedDistributorCode)
        && (row.metadata.positionId === this.selectedSubaccountCode || row.metadata.positionId === this.selectedDistributorCode))
    };

    const columnWidthClass = this.getColumnWidthClass();
    if (columnWidthClass) {
      classes[columnWidthClass] = true;
    }

    return classes;
  }

  public getDismissableTotalRowClasses(): CssClasses {
    let classes: CssClasses = {
      'selected': (!this.selectedSkuPackageCode && this.dismissableTotalRow) ? true : false
    };

    const columnWidthClass = this.getColumnWidthClass();
    if (columnWidthClass) {
      classes[columnWidthClass] = true;
    }

    return classes;
  }

  private updateSortingFunction() {
    if (this._sortingCriteria.length) {
      this.sortingFunction = (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => {
        let i: number = 0;
        let currentColumn: string;
        let currentSortOrder: number;
        this._sortingCriteria.every((criterion, idx) => {
          i = idx;
          currentColumn = ColumnType[criterion.columnType];
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
      this.sortedTableData = this.sortedTableData.sort(this.sortingFunction);
    }
  }
}
