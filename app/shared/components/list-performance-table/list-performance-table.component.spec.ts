import { By } from '@angular/platform-browser';
import { Component, Input, SimpleChange } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import * as Chance from 'chance';

import { CalculatorService } from '../../../services/calculator.service';
import { ListPerformanceColumnType } from '../../../enums/list-performance-column-types.enum';
import { getListPerformanceTableRowMock } from '../../../models/list-performance/list-performance-table-row.model.mock';
import { getSortingCriteriaMock } from '../../../models/my-performance-table-sorting-criteria.model.mock';
import { LoadingState } from '../../../enums/loading-state.enum';
import { ListPerformanceTableComponent } from './list-performance-table.component';
import { ListPerformanceTableRow } from '../../../models/list-performance/list-performance-table-row.model';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material';
import { RowType } from '../../../enums/row-type.enum';
import { SortStatus } from '../../../enums/sort-status.enum';
import { SortIndicatorComponent } from '../sort-indicator/sort-indicator.component';

const chance = new Chance();

@Component({
  selector: 'beer-loader',
  template: ''
})
class BeerLoaderComponentMock {
  @Input() showLoader: false;
}

@Component({
  selector: '[list-performance-table-row]',
  template: ''
})
class MockListPerformanceTableRowComponent {
  @Input() rowData: ListPerformanceTableRow;
}

describe('ListPerformanceTableComponent', () => {
  let fixture: ComponentFixture<ListPerformanceTableComponent>;
  let componentInstance: ListPerformanceTableComponent;
  let tableHeaderRow: Array<string> = ['Col1', 'Col2', 'Col3', 'Col4', 'Col5', 'Col6'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [
        BeerLoaderComponentMock,
        MockListPerformanceTableRowComponent,
        ListPerformanceTableComponent,
        SortIndicatorComponent
      ],
      providers: [
        CalculatorService
      ]
    });

    fixture = TestBed.createComponent(ListPerformanceTableComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.tableHeaderRow = tableHeaderRow;
    componentInstance.sortingCriteria = getSortingCriteriaMock(1);
  });

  describe('setSortingcriteria', () => {

    it('should sort the data with one criterion', () => {
      const tableData = getListPerformanceTableRowMock(2);

      componentInstance.tableData = tableData;
      const sortingCriteria = getSortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      const firstSortingCriterion = sortingCriteria[0];
      const firstColumnType = ListPerformanceColumnType[sortingCriteria[0].columnType];

      fixture.detectChanges();
      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockListPerformanceTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockListPerformanceTableRowComponent) as MockListPerformanceTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockListPerformanceTableRowComponent) as MockListPerformanceTableRowComponent;

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
      let tableData = getListPerformanceTableRowMock(3);
      tableData[0].descriptionRow0 = 'b';
      tableData[0].metricColumn0 = 1;
      tableData[1].descriptionRow0 = 'a';
      tableData[1].metricColumn0 = 0;
      tableData[2].descriptionRow0 = 'b';
      tableData[2].metricColumn0 = 2;
      componentInstance.tableData = tableData.slice();

      const sortingCriteria = [
        {
          columnType: ListPerformanceColumnType.descriptionRow0,
          ascending: true
        },
        {
          columnType: ListPerformanceColumnType.metricColumn0,
          ascending: false
        }
      ];
      componentInstance.sortingCriteria = sortingCriteria;

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockListPerformanceTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockListPerformanceTableRowComponent) as MockListPerformanceTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockListPerformanceTableRowComponent) as MockListPerformanceTableRowComponent;
      const rowComponent2 = mockElements[2]
        .injector
        .get(MockListPerformanceTableRowComponent) as MockListPerformanceTableRowComponent;

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
      const firstColumnType = ListPerformanceColumnType[sortingCriteria[0].columnType];

      const tableData = getListPerformanceTableRowMock(2);
      componentInstance.tableData = tableData;

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockListPerformanceTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockListPerformanceTableRowComponent) as MockListPerformanceTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockListPerformanceTableRowComponent) as MockListPerformanceTableRowComponent;

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

  describe('getTableBodyClasses', () => {
    it('should return the total-row-present class when total row is present', () => {
      const totalRowMock: ListPerformanceTableRow = getListPerformanceTableRowMock(1)[0];
      const dismissibleTotalRowMock: ListPerformanceTableRow = null;
      componentInstance.totalRow = totalRowMock;

      const tableBodyClass = componentInstance.getTableBodyClasses();
      expect(tableBodyClass).toBe('total-row-present');
    });

    it('should return the total-row-absent class when total row is absent', () => {
      const totalRowMock: ListPerformanceTableRow = null;
      const dismissibleTotalRowMock: ListPerformanceTableRow = null;
      componentInstance.totalRow = totalRowMock;

      const tableBodyClass = componentInstance.getTableBodyClasses();
      expect(tableBodyClass).toBe('total-row-absent');
    });
  });

  describe('when calling onRowClicked', () => {
    let rowTypeMock: RowType = RowType.data;
    let indexMock: number;
    let listPerformanceTableRowMock: ListPerformanceTableRow;

    beforeEach(() => {
      indexMock = chance.natural();
      listPerformanceTableRowMock = getListPerformanceTableRowMock(1)[0];
      spyOn(componentInstance.onElementClicked, 'emit');
    });

  });

  describe('when a row is clicked', () => {
    it('should call the event handler onRowClicked', () => {
      const onRowClickedSpy = spyOn(componentInstance, 'onRowClicked');
      spyOn(componentInstance, 'getSortStatus').and.callFake(() => SortStatus.ascending);
      componentInstance.tableData = getListPerformanceTableRowMock(1);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('tbody tr').click();
      expect(onRowClickedSpy).toHaveBeenCalled();
    });
  });

  describe('when the checkbox for all stores is selected', () => {
    it('should check all the elements', () => {
      const selectAllStoresSpy = spyOn(componentInstance, 'selectAllStores');
      let tableData = getListPerformanceTableRowMock(2);
      componentInstance.tableData = tableData;

      fixture.nativeElement.querySelector('mat-checkbox input').click();
      fixture.detectChanges();
      expect(selectAllStoresSpy).toHaveBeenCalled();
      expect(componentInstance.sortedTableData[0].checked).toEqual(true);
      expect(componentInstance.sortedTableData[1].checked).toEqual(true);
    });
  });

  describe('getEntityRowClasses', () => {
    let rowData: ListPerformanceTableRow;
    beforeEach(() => {
      rowData = getListPerformanceTableRowMock(1)[0];
      rowData.performanceError = false;
    });

    it('should disable classes by default', () => {
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-entity-row': rowData.checked
      });
    });
  });
});
