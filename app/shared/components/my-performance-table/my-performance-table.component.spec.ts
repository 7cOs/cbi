import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ColumnType } from '../../../enums/column-type.enum';
import { DateRange } from '../../../models/date-range.model';
import { getDateRangeMock } from '../../../models/date-range.model.mock';
import { getMyPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { getSortingCriteriaMock } from '../../../models/my-performance-table-sorting-criteria.model.mock';
import { MyPerformanceTableComponent } from './my-performance-table.component';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
import { SortIndicatorComponent } from '../sort-indicator/sort-indicator.component';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: '[my-performance-table-row]',
  template: ''
})
class MockMyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;
  @Input() showContributionToVolume: boolean;
  @Input() showOpportunities: boolean;
  @Input() viewType: SalesHierarchyViewType | ProductMetricsViewType;
  @Input() dateRange: DateRange;
}

describe('MyPerformanceTableComponent', () => {

  let fixture: ComponentFixture<MyPerformanceTableComponent>;
  let componentInstance: MyPerformanceTableComponent;
  let tableHeaderRow: Array<string> = ['column1', 'column2', 'column3'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyPerformanceTableComponent,
        MockMyPerformanceTableRowComponent,
        SortIndicatorComponent
      ],
      providers: [
        UtilService
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceTableComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.tableHeaderRow = tableHeaderRow;

  });

  describe('setSortingcriteria', () => {

    it('should sort the data with one criterion', () => {
      const tableData = getMyPerformanceTableRowMock(2);

      componentInstance.tableData = tableData;

      const sortingCriteria = getSortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      componentInstance.dateRange  = getDateRangeMock();
      const firstSortingCriterion = sortingCriteria[0];
      const firstColumnType = ColumnType[sortingCriteria[0].columnType];

      fixture.detectChanges();
      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockMyPerformanceTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;

      expect(rowComponent0.rowData).toBeTruthy();
      expect(rowComponent1.rowData).toBeTruthy();

      const sortingRespected =
        rowComponent0.rowData[firstColumnType] === rowComponent1.rowData[firstColumnType]
        || firstSortingCriterion.ascending
          && rowComponent0.rowData[firstColumnType] < rowComponent1.rowData[firstColumnType]
        || !firstSortingCriterion.ascending
          && rowComponent0.rowData[firstColumnType] > rowComponent1.rowData[firstColumnType];
      expect(sortingRespected).toBeTruthy();
    });

    it('should sort the data with two criteria', () => {
      let tableData = getMyPerformanceTableRowMock(3);
      tableData[0].descriptionRow0 = 'b';
      tableData[0].metricColumn0 = 1;
      tableData[1].descriptionRow0 = 'a';
      tableData[1].metricColumn0 = 0;
      tableData[2].descriptionRow0 = 'b';
      tableData[2].metricColumn0 = 2;
      componentInstance.tableData = tableData.slice();
      componentInstance.dateRange = getDateRangeMock();

      const sortingCriteria = [
        {
          columnType: ColumnType.descriptionRow0,
          ascending: true
        },
        {
          columnType: ColumnType.metricColumn0,
          ascending: false
        }
      ];
      componentInstance.sortingCriteria = sortingCriteria;

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockMyPerformanceTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent2 = mockElements[2]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;

      expect(rowComponent0.rowData).toBeTruthy();
      expect(rowComponent1.rowData).toBeTruthy();
      expect(rowComponent2.rowData).toBeTruthy();

      expect(rowComponent0.rowData).toBe(tableData[1]);
      expect(rowComponent1.rowData).toBe(tableData[2]);
      expect(rowComponent2.rowData).toBe(tableData[0]);
    });

  });

  describe('setTableData', () => {

    it('should sort the data if some sorting criteria were present', () => {
      const sortingCriteria = getSortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      const firstSortingCriterion = sortingCriteria[0];
      const firstColumnType = ColumnType[sortingCriteria[0].columnType];

      const tableData = getMyPerformanceTableRowMock(2);
      componentInstance.tableData = tableData;
      componentInstance.dateRange = getDateRangeMock();

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockMyPerformanceTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;

      expect(rowComponent0.rowData).toBeTruthy();
      expect(rowComponent1.rowData).toBeTruthy();

      const sortingRespected =
        rowComponent0.rowData[firstColumnType] === rowComponent1.rowData[firstColumnType]
        || firstSortingCriterion.ascending
          && rowComponent0.rowData[firstColumnType] < rowComponent1.rowData[firstColumnType]
        || !firstSortingCriterion.ascending
          && rowComponent0.rowData[firstColumnType] > rowComponent1.rowData[firstColumnType];
      expect(sortingRespected).toBeTruthy();
    });
  });

  describe('getTableHeight', () => {

    it('should set the proper class to set the table height when 2 total rows are present', () => {
      const totalRowsMock: Array<MyPerformanceTableRow> = getMyPerformanceTableRowMock(2);
      componentInstance.totalRow = totalRowsMock[0];
      componentInstance.dismissableTotalRow = totalRowsMock[1];
      const tableClass = componentInstance.getTableHeight();
      expect(tableClass).toBe('two-total-rows-present');
    });

    it('should set the proper class to set the table height when total row is present', () => {
      const totalRowMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      componentInstance.totalRow = totalRowMock;
      const tableClass = componentInstance.getTableHeight();
      expect(tableClass).toBe('total-row-present');
    });

    it('should set the proper class to set the table height when total row is absent', () => {
      let totalRowMock: MyPerformanceTableRow = null;

      componentInstance.totalRow = totalRowMock;
      const tableClass = componentInstance.getTableHeight();
      expect(tableClass).toBe('total-row-absent');
    });
  });
});
