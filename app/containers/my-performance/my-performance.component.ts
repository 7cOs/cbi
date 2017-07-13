//tslint:disable
import { Component, EventEmitter } from '@angular/core';

import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { myPerformanceTableData, myPerformanceTotalRowData } from '../../models/my-performance-table-data.model.mock';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { SortingCriteria } from '../../models/sorting-criteria.model';

@Component({
  selector: 'my-performance',
  template: require('./my-performance.component.pug'),
  styles: [require('./my-performance.component.scss')]
})

export class MyPerformanceComponent {
  private _tableHeaderRow: string[] = ['People', 'Depletions', 'CTV'];
  private _performanceMetric: string = 'Depletions';
  private _dateRange: DateRange = getDateRangeMock();
  private _tableData: MyPerformanceTableRow[] = myPerformanceTableData;
  private _totalRowData: MyPerformanceTableRow = myPerformanceTotalRowData;
  private _sortingCriteria: SortingCriteria[] = [<SortingCriteria>{columnType: ColumnType.metricColumn0, ascending: false}];
  private _showOpportunities: boolean = true;
  
  private handleSortRows(criterias: SortingCriteria[]): void {
    console.log(criterias);
    this._sortingCriteria = criterias;
  }
}
