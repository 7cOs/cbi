import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import * as Chance from 'chance';

import { CalculatorService } from '../../../services/calculator.service';
import { getListOpportunitiesTableRowMock } from '../../../models/list-opportunities/list-opportunities-table-row.model.mock';
import { getSortingCriteriaMock } from '../../../models/my-performance-table-sorting-criteria.model.mock';
import { ListOpportunitiesColumnType } from '../../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableComponent } from './list-opportunities-table.component';
import { ListOpportunitiesTableRow } from '../../../models/list-opportunities/list-opportunities-table-row.model';
import { MatCheckboxModule } from '@angular/material';
import { SortIndicatorComponent } from '../sort-indicator/sort-indicator.component';
import { SortStatus } from '../../../enums/sort-status.enum';

const chance = new Chance();

@Component({
  selector: 'beer-loader',
  template: ''
})

class BeerLoaderComponentMock {
  @Input() showLoader: false;
}

@Component({
  selector: '[list-opportunities-table-row]',
  template: ''
})

class MockListOpportunitiesTableRowComponent {
  @Input() rowData: ListOpportunitiesTableRow;
}

describe('ListOpportunitiesTableComponent', () => {
  let fixture: ComponentFixture<ListOpportunitiesTableComponent>;
  let componentInstance: ListOpportunitiesTableComponent;
  let tableHeaderRow: Array<string> = ['Col1', 'Col2', 'Col3', 'Col4', 'Col5', 'Col6'];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [
        BeerLoaderComponentMock,
        MockListOpportunitiesTableRowComponent,
        ListOpportunitiesTableComponent,
        SortIndicatorComponent
      ],
      providers: [
        CalculatorService
      ]
    });

    fixture = TestBed.createComponent(ListOpportunitiesTableComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.tableHeaderRow = tableHeaderRow;
    componentInstance.sortingCriteria = getSortingCriteriaMock(1);
  });

  describe('setSortingcriteria', () => {

    it('should sort the data with one criterion', () => {
      const tableData = getListOpportunitiesTableRowMock(2);

      componentInstance.tableData = tableData;
      const sortingCriteria = getSortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
      const firstSortingCriterion = sortingCriteria[0];
      const firstColumnType = ListOpportunitiesColumnType[sortingCriteria[0].columnType];

      fixture.detectChanges();
      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockListOpportunitiesTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockListOpportunitiesTableRowComponent) as MockListOpportunitiesTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockListOpportunitiesTableRowComponent) as MockListOpportunitiesTableRowComponent;

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
      let tableData = getListOpportunitiesTableRowMock(3);
      tableData[0].storeColumn = 'b';
      tableData[0].cytdColumn = 1;
      tableData[1].storeColumn = 'a';
      tableData[1].cytdColumn = 0;
      tableData[2].storeColumn = 'b';
      tableData[2].cytdColumn = 2;
      componentInstance.tableData = tableData.slice();

      const sortingCriteria = [
        {
          columnType: ListOpportunitiesColumnType.storeColumn,
          ascending: true
        },
        {
          columnType: ListOpportunitiesColumnType.cytdColumn,
          ascending: false
        }
      ];
      componentInstance.sortingCriteria = sortingCriteria;

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockListOpportunitiesTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockListOpportunitiesTableRowComponent) as MockListOpportunitiesTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockListOpportunitiesTableRowComponent) as MockListOpportunitiesTableRowComponent;
      const rowComponent2 = mockElements[2]
        .injector
        .get(MockListOpportunitiesTableRowComponent) as MockListOpportunitiesTableRowComponent;

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
      const firstColumnType = ListOpportunitiesColumnType[sortingCriteria[0].columnType];

      const tableData = getListOpportunitiesTableRowMock(2);
      componentInstance.tableData = tableData;

      fixture.detectChanges();

      const mockElements = fixture.debugElement
        .queryAll(By.directive(MockListOpportunitiesTableRowComponent));
      const rowComponent0 = mockElements[0]
        .injector
        .get(MockListOpportunitiesTableRowComponent) as MockListOpportunitiesTableRowComponent;
      const rowComponent1 = mockElements[1]
        .injector
        .get(MockListOpportunitiesTableRowComponent) as MockListOpportunitiesTableRowComponent;

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

  describe('when calling onRowClicked', () => {
    let indexMock: number;
    let listOpportunitiesTableRowMock: ListOpportunitiesTableRow;

    beforeEach(() => {
      indexMock = chance.natural();
      listOpportunitiesTableRowMock = getListOpportunitiesTableRowMock(1)[0];
      spyOn(componentInstance.onElementClicked, 'emit');
    });

  });

  describe('when a row is clicked', () => {
    it('should call the event handler onRowClicked', () => {
      const onRowClickedSpy = spyOn(componentInstance, 'onRowClicked');
      spyOn(componentInstance, 'getSortStatus').and.callFake(() => SortStatus.ascending);
      componentInstance.tableData = getListOpportunitiesTableRowMock(1);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('tbody tr').click();
      expect(onRowClickedSpy).toHaveBeenCalled();
    });
  });

  describe('when isSelectAllChecked is false and it is clicked', () => {
    it('should check all the elements', () => {
      componentInstance.isSelectAllChecked = false;
      componentInstance.tableData = getListOpportunitiesTableRowMock(2);
      fixture.detectChanges();

      componentInstance.toggleSelectAllStores({checked: true, source: fixture.nativeElement});
      fixture.detectChanges();

      expect(componentInstance.sortedTableData[0].checked).toEqual(true);
      expect(componentInstance.sortedTableData[1].checked).toEqual(true);

      componentInstance.toggleSelectAllStores({checked: false, source: fixture.nativeElement});
      fixture.detectChanges();

      expect(componentInstance.sortedTableData[0].checked).toEqual(false);
      expect(componentInstance.sortedTableData[1].checked).toEqual(false);
    });
  });

  describe('getEntityRowClasses', () => {
    let rowData: ListOpportunitiesTableRow;
    beforeEach(() => {
      rowData = getListOpportunitiesTableRowMock(1)[0];
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

  describe('when isSelectedAllChecked is false', () => {
    it('should set isIndeterminate to true for mixed checkboxes', () => {
      componentInstance.isSelectAllChecked = false;
      componentInstance.tableData = getListOpportunitiesTableRowMock(2);
      componentInstance.sortedTableData[0].checked = true;
      fixture.detectChanges();

      componentInstance.setCheckboxStates(1, 1);
      expect(componentInstance.isIndeterminateChecked).toEqual(true);
    });
    it('should set isIndeterminate to false for all true checkboxes', () => {
      componentInstance.isSelectAllChecked = false;
      componentInstance.tableData = getListOpportunitiesTableRowMock(2);
      componentInstance.sortedTableData[0].checked = true;
      componentInstance.sortedTableData[1].checked = true;
      fixture.detectChanges();

      componentInstance.setCheckboxStates(2, 0);
      expect(componentInstance.isIndeterminateChecked).toEqual(false);
    });
    it('should set isIndeterminate to true', () => {
      componentInstance.isSelectAllChecked = false;
      componentInstance.tableData = getListOpportunitiesTableRowMock(2);
      componentInstance.sortedTableData[0].checked = false;
      componentInstance.sortedTableData[1].checked = false;
      fixture.detectChanges();

      componentInstance.setCheckboxStates(0, 2);
      expect(componentInstance.isIndeterminateChecked).toEqual(false);
    });
  });

  describe('when pageChange Data input is received', () => {
    it('should set page start, page end', () => {
      componentInstance.opportunitiesTableData = getListOpportunitiesTableRowMock(300);
      componentInstance.handlePageChangeClicked({pageStart: 80, pageEnd: 100});
      expect(componentInstance.sliceStart).toBe(80);
      expect(componentInstance.sliceStart).toBe(100);
    });
  });
});
