import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ColumnType } from '../../../enums/column-type.enum';
import { MyPerformanceTableComponent } from './my-performance-table.component';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { myPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { SortableComponent } from '../sortable/sortable.component';
import { sortingCriteriaMock } from '../../../models/my-performance-table-sorting-criteria.model.mock';

@Component({
  selector: '[my-performance-table-row]',
  template: ''
})

class MockMyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;
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
        SortableComponent
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceTableComponent);
    // fixture.autoDetectChanges();
    componentInstance = fixture.componentInstance;
    componentInstance.tableHeaderRow = tableHeaderRow;
  });

  describe('setSortingcriteria', () => {

    it('should sort the data with one criterion', () => {
      const tableData = myPerformanceTableRowMock(2);
      componentInstance.tableData = tableData;

      const sortingCriteria = sortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      const firstSortingCriterion = sortingCriteria[0];
      const firstColumnType = ColumnType[sortingCriteria[0].columnType];

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockMyPerformanceTableRowComponent));
      // The index 0 contains an empty component for whatever reason
      const rowComponent0 = mockElements[1]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent1 = mockElements[2]
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
      let tableData = myPerformanceTableRowMock(3);
      tableData[0].descriptionLine0 = 'b';
      tableData[0].metricColumn0 = 1;
      tableData[1].descriptionLine0 = 'a';
      tableData[1].metricColumn0 = 0;
      tableData[2].descriptionLine0 = 'b';
      tableData[2].metricColumn0 = 2;
      componentInstance.tableData = tableData.slice();

      const sortingCriteria = [
        {
          columnType: ColumnType.descriptionLine0,
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
      // The index 0 contains an empty component for whatever reason
      const rowComponent0 = mockElements[1]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent1 = mockElements[2]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent2 = mockElements[3]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;

      expect(rowComponent0.rowData).toBeTruthy();
      expect(rowComponent1.rowData).toBeTruthy();
      expect(rowComponent2.rowData).toBeTruthy();

      expect(rowComponent0.rowData).toBe(tableDataRows[1]);
      expect(rowComponent1.rowData).toBe(tableDataRows[2]);
      expect(rowComponent2.rowData).toBe(tableDataRows[0]);
    });

  });

  describe('setTableData', () => {

    it('should sort the data if some sorting criteria were present', () => {
      const sortingCriteria = sortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      const firstSortingCriterion = sortingCriteria[0];
      const firstColumnType = ColumnType[sortingCriteria[0].columnType];

      const tableData = myPerformanceTableRowMock(2);
      componentInstance.tableData = tableData;

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockMyPerformanceTableRowComponent));
      // The index 0 contains an empty component for whatever reason
      const rowComponent0 = mockElements[1]
        .injector
        .get(MockMyPerformanceTableRowComponent) as MockMyPerformanceTableRowComponent;
      const rowComponent1 = mockElements[2]
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

});
