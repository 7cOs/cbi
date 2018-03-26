import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { sortBy } from 'lodash';

import { CalculatorService } from '../../../services/calculator.service';
import { ColumnType } from '../../../enums/column-type.enum';
import { CssClasses } from '../../../models/css-classes.model';
import { DateRange } from '../../../models/date-range.model';
import { EntityPeopleType } from '../../../enums/entity-responsibilities.enum';
import { LoadingState } from '../../../enums/loading-state.enum';
import { ListPerformanceTableRow } from '../../../models/list-performance/list-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { RowType } from '../../../enums/row-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
import { SortingCriteria } from '../../../models/sorting-criteria.model';
import { SortIndicatorComponent } from '../sort-indicator/sort-indicator.component';
import { SortStatus } from '../../../enums/sort-status.enum';

interface SortWeightArray {
  index: number;
  sortWeight: number;
}

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
    }
  }

  @Input() dateRange: DateRange;
  @Input() performanceMetric: string;
  @Input() showDateRange: boolean = false;
  @Input() showOpportunities: boolean = false;
  @Input() opportunitiesError: boolean = false;
  @Input() showContributionToVolume: boolean = false;
  @Input() tableHeaderRow: Array<string> = ['Store', 'Distributor', 'Segment', 'Depeltions', ' Effective POD', 'Last Depletion'];
  @Input() totalRow: ListPerformanceTableRow = {
    descriptionRow0: 'descrow0',
    descriptionRow1: 'descrow1',
    descriptionRow2: 'descrow2',
    metricColumn0: 0,
    metricColumn1: 1,
    metricColumn2: 2,
    metricColumn3: 3,
    metricColumn4: 4,
    metricColumn5: 5,
    depletionDate: '2017-08-01',
    performanceError: false
  };
  @Input() viewType: SalesHierarchyViewType | ProductMetricsViewType;
  @Input() loadingState: LoadingState.Loaded;

  public sortedTableData: Array<ListPerformanceTableRow>;
  public columnType = ColumnType;
  public rowType = RowType;
  public loadingStateEnum = LoadingState;
  public rippleColor: string = 'rgba(17, 119, 184, 0.05)';
  public tableClasses: CssClasses = {};

  private sortingFunction: (elem0: ListPerformanceTableRow, elem1: ListPerformanceTableRow) => number;
  private _sortingCriteria: Array<SortingCriteria> = [{
    columnType: ColumnType.metricColumn0,
    ascending: false
  }];

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
    return (this.totalRow) ? 'total-row-present' : 'total-row-absent';
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

  public onRowClicked(type: RowType, index: number, row?: ListPerformanceTableRow) {
      this.onElementClicked.emit({type: type, index: index, row: row});
  }

  public getSubHeaderClasses(): string {
    let style = '';

    if (this.totalRow) {
      style = style.concat(' no-sub-header-border');
    }

    return style;
  }

  public getEntityRowClasses(row: ListPerformanceTableRow): CssClasses {
    let classes: CssClasses = {
      'performance-error': row.performanceError
    };

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

  private getTableClasses(viewType: SalesHierarchyViewType | ProductMetricsViewType, loadingState: LoadingState): CssClasses {
    return {
      [`view-type-${viewType}`]: true,
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
      const sortedData: Array<ListPerformanceTableRow> = this.sortedTableData.sort(this.sortingFunction);
      this.sortedTableData = sortedData;
    }
  }
}
