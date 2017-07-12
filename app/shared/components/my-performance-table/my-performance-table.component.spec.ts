import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ColumnType } from '../../../enums/column-type.enum';
import { MyPerformanceTableComponent } from './my-performance-table.component';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { myPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { sortingCriteriaMock } from '../../../models/my-performance-table-sorting-criteria.model.mock';

@Component({
  selector: 'my-performance-table-row',
  template: ''
})

class MockMyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;
}

describe('MyPerformanceTableComponent', () => {

  let fixture: ComponentFixture<MyPerformanceTableComponent>;
  let componentInstance: MyPerformanceTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyPerformanceTableComponent,
        MockMyPerformanceTableRowComponent
      ],
      providers: [
        MyPerformanceTableComponent
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceTableComponent);
    // fixture.autoDetectChanges();
    componentInstance = fixture.componentInstance;
  });

  describe('setSortingcriteria', () => {

    it('should sort the data with one criterion', () => {
      const tableData = myPerformanceTableRowMock(2);
      componentInstance.tableData = tableData;

      const sortingCriteria = sortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      const firstSortingCriterion = sortingCriteriaMock[0];
      const firstColumnType = ColumnType[sortingCriteriaMock[0].columnType];

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
      let tableDataRows = createRandomDataRows(3);
      tableDataRows[0].descriptionLine0 = 'b';
      tableDataRows[0].metricColumn0 = 1;
      tableDataRows[1].descriptionLine0 = 'a';
      tableDataRows[1].metricColumn0 = 0;
      tableDataRows[2].descriptionLine0 = 'b';
      tableDataRows[2].metricColumn0 = 2;
      componentInstance.tableDataRows = tableDataRows.slice();

      const sortingCriteriaMock = [
        {
          columnType: ColumnType.descriptionLine0,
          ascending: true
        },
        {
          columnType: ColumnType.metricColumn0,
          ascending: false
        }
      ];
      componentInstance.sortingCriteria = sortingCriteriaMock;

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

  describe('setTableDataRows', () => {

    it('should sort the data if some sorting criteria were present', () => {
      const sortingCriteria = sortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      const firstSortingCriterion = sortingCriteriaMock[0];
      const firstColumnType = ColumnType[sortingCriteriaMock[0].columnType];

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
