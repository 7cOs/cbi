//tslint:disable
import { Component, EventEmitter } from '@angular/core';

import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { SortingCriteria } from '../../models/sorting-criteria.model';

// mocks
import { dateRangeDTOsMock } from '../../models/date-range-dto-collection.model.mock';
import { myPerformanceTableData,
         myPerformanceTotalRowData,
         myPerformanceRightTableData,
         myPerformanceSkusData,
         myPerformanceSkuTotalData } from '../../models/my-performance-table-data.model.mock';

@Component({
  selector: 'my-performance',
  template: require('./my-performance.component.pug'),
  styles: [require('./my-performance.component.scss')]
})

export class MyPerformanceComponent {
  private _tableHeaderRowLeft: Array<string> = ['People','Depletions','CYTD'];
  private _tableHeaderRowRight: Array<string> = ['Brand','Depletions','CYTD'];
  private _performanceMetric: string = 'Depletions';
  private _dateRange: DateRange = getDateRangeMock();
  private _tableData: MyPerformanceTableRow[] = myPerformanceTableData;
  private _rightTableData: MyPerformanceTableRow[] = myPerformanceRightTableData; 
  private _totalRowData: MyPerformanceTableRow = myPerformanceTotalRowData;
  private _showOpportunities: boolean = true;
  private _skusData = myPerformanceSkusData;
  private _skuTotalData = myPerformanceSkuTotalData;
  
  private _sortingCriteria: Array<SortingCriteria> = [{columnType: ColumnType.metricColumn0, ascending: false}];
  private _dateRanges = dateRangeDTOsMock;

  private handleSortRows(criteria: SortingCriteria[]): void {
    console.log(criteria);
    this._sortingCriteria = criteria;
  }

  private handleElementClicked(row: MyPerformanceTableRow, index: number) {
    console.log(row);
    console.log(index);
  }
}
