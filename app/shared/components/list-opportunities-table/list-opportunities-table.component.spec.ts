import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { CalculatorService } from '../../../services/calculator.service';
import { getListOpportunitiesTableRowMock } from '../../../models/list-opportunities/list-opportunities-table-row.model.mock';
import { getSortingCriteriaMock } from '../../../models/my-performance-table-sorting-criteria.model.mock';
import { ListOpportunitiesColumnType } from '../../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableComponent } from './list-opportunities-table.component';
import { ListOpportunitiesTableRow } from '../../../models/list-opportunities/list-opportunities-table-row.model';
import { ListTableDrawerRow } from '../../../models/lists/list-table-drawer-row.model';
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

@Component({
  selector: 'list-table-drawer',
  template: ''
})
class ListTableDrawerComponentMock {
  @Output() onOpportunityTypeClicked: EventEmitter<Event> = new EventEmitter();
  @Input() tableData: ListTableDrawerRow[];
}

describe('ListOpportunitiesTableComponent', () => {
  let fixture: ComponentFixture<ListOpportunitiesTableComponent>;
  let componentInstance: ListOpportunitiesTableComponent;
  const tableHeaderRow: Array<string> = ['Col1', 'Col2', 'Col3', 'Col4', 'Col5', 'Col6'];
  let opportunitiesTableData: ListOpportunitiesTableRow[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [
        BeerLoaderComponentMock,
        MockListOpportunitiesTableRowComponent,
        ListOpportunitiesTableComponent,
        ListTableDrawerComponentMock,
        SortIndicatorComponent
      ],
      providers: [
        CalculatorService
      ]
    });

    opportunitiesTableData = getListOpportunitiesTableRowMock(3);

    fixture = TestBed.createComponent(ListOpportunitiesTableComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.tableHeaderRow = tableHeaderRow;
    componentInstance.sortingCriteria = getSortingCriteriaMock(1);
    componentInstance.tableData = opportunitiesTableData;

    fixture.detectChanges();
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

    it('should set isExpandAll, isSelectAllChecked, and isIndeterminateChecked to false', () => {
      expect(componentInstance.isExpandAll).toBe(false);
      expect(componentInstance.isSelectAllChecked).toBe(false);
      expect(componentInstance.isIndeterminateChecked).toBe(false);

      componentInstance.isExpandAll = true;
      componentInstance.isSelectAllChecked = true;
      componentInstance.isIndeterminateChecked = true;
      fixture.detectChanges();

      componentInstance.tableData = getListOpportunitiesTableRowMock(2);
      fixture.detectChanges();

      expect(componentInstance.isExpandAll).toBe(false);
      expect(componentInstance.isSelectAllChecked).toBe(false);
      expect(componentInstance.isIndeterminateChecked).toBe(false);
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
    it('should toggle the checked state of each table row and each child opportunity row between true/false', () => {
      componentInstance.isSelectAllChecked = false;
      componentInstance.tableData = getListOpportunitiesTableRowMock(2);
      fixture.detectChanges();

      componentInstance.toggleSelectAllStores({checked: true, source: fixture.nativeElement});
      fixture.detectChanges();

      expect(componentInstance.sortedTableData[0].checked).toEqual(true);
      expect(componentInstance.sortedTableData[1].checked).toEqual(true);

      componentInstance.sortedTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        tableRow.opportunities.forEach((opportunityRow: ListTableDrawerRow) => {
          expect(opportunityRow.checked).toBe(true);
        });
      });

      componentInstance.toggleSelectAllStores({checked: false, source: fixture.nativeElement});
      fixture.detectChanges();

      expect(componentInstance.sortedTableData[0].checked).toEqual(false);
      expect(componentInstance.sortedTableData[1].checked).toEqual(false);

      componentInstance.sortedTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        tableRow.opportunities.forEach((opportunityRow: ListTableDrawerRow) => {
          expect(opportunityRow.checked).toBe(false);
        });
      });
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

  describe('when an onCheckboxClicked event is emitted and onOpportunityCheckboxClicked is called', () => {
    it('should set the checked state of the parent store row to true if every opportunity row is checked', () => {
      const expectedCheckedState = opportunitiesTableData[0].opportunities.length > 1 ? false : true;

      opportunitiesTableData[0].opportunities[0].checked = true;
      componentInstance.onOpportunityCheckboxClicked(opportunitiesTableData[0]);
      fixture.detectChanges();

      expect(opportunitiesTableData[0].checked).toBe(expectedCheckedState);

      opportunitiesTableData[0].opportunities.forEach((opportunityRow: ListTableDrawerRow) => {
        opportunityRow.checked = true;
      });
      componentInstance.onOpportunityCheckboxClicked(opportunitiesTableData[0]);
      fixture.detectChanges();

      expect(opportunitiesTableData[0].checked).toBe(true);

      opportunitiesTableData[0].opportunities[0].checked = false;
      componentInstance.onOpportunityCheckboxClicked(opportunitiesTableData[0]);
      fixture.detectChanges();

      expect(opportunitiesTableData[0].checked).toBe(false);
    });
  });

  describe('when the expand all column is clicked', () => {
    it('should toggle the expanded field of every store row between true/false', () => {
      opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        expect(tableRow.expanded).toBe(false);
      });

      fixture.debugElement.query(By.css('.expand-all-column')).nativeElement.click();
      fixture.detectChanges();

      opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        expect(tableRow.expanded).toBe(true);
      });

      fixture.debugElement.query(By.css('.expand-all-column')).nativeElement.click();
      fixture.detectChanges();

      opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        expect(tableRow.expanded).toBe(false);
      });
    });
  });

  describe('when pageChange Data input is received', () => {
    it('should set page start, page end', () => {
      componentInstance.opportunitiesTableData = getListOpportunitiesTableRowMock(300);
      componentInstance.handlePageChangeClicked({pageStart: 80, pageEnd: 100});
      expect(componentInstance.sliceStart).toBe(80);
      expect(componentInstance.sliceEnd).toBe(100);
    });
  });
});
