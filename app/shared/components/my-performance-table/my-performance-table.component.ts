import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ColumnType } from '../../../enums/column-type.enum';
import { DateRange } from '../../../models/date-range.model';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { RowType } from '../../../enums/row-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortStatus } from '../../../enums/sort-status.enum';
import { UtilService } from '../../../services/util.service';
import { ViewType } from '../../../enums/view-type.enum';

@Component({
  selector: 'my-performance-table',
  template: require('./my-performance-table.component.pug'),
  styles: [ require('./my-performance-table.component.scss') ]
})
export class MyPerformanceTableComponent {
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: MyPerformanceTableRow}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();

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
  @Input() showBackButton: boolean = true;
  @Input() showOpportunities: boolean = true;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() viewType: ViewType;

  public sortedTableData: Array<MyPerformanceTableRow>;
  public columnType = ColumnType;
  public rowType = RowType;

  private sortingFunction: (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = null;

  constructor (private utilService: UtilService) { }

  public centerColumnsWidth(): string {
    return this.showOpportunities ? 'col-50-pct' : 'col-60-pct';
  }

  public columnWidth(): string {
    return this.showOpportunities ? 'col-16-pct' : 'col-20-pct';
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

  private updateSortingFunction() {
    if (this._sortingCriteria.length) {
      this.sortingFunction = (elem0: MyPerformanceTableRow, elem1: MyPerformanceTableRow) => {
        let i: number = 0;
        let currentColumn: string;
        let currentSortOrder: number;
        this._sortingCriteria.every((criterion, idx) => {
          i = idx;
          currentColumn = ColumnType[criterion.columnType];
          currentSortOrder = this.utilService.compareObjects(elem0[currentColumn], (elem1[currentColumn]));
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
