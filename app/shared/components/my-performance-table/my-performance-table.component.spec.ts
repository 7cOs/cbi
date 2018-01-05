import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatRippleModule } from '@angular/material';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import * as Chance from 'chance';

import { CalculatorService } from '../../../services/calculator.service';
import { ColumnType } from '../../../enums/column-type.enum';
import { getDateRangeMock } from '../../../models/date-range.model.mock';
import { getLoadingStateMock } from '../../../enums/loading-state.enum.mock';
import { getMyPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { getProductMetricsViewTypeMock } from '../../../enums/product-metrics-view-type.enum.mock';
import { getSortingCriteriaMock } from '../../../models/my-performance-table-sorting-criteria.model.mock';
import { getSalesHierarchyViewTypeMock } from '../../../enums/sales-hierarchy-view-type.enum.mock';
import { MyPerformanceTableComponent } from './my-performance-table.component';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
import { RowType } from '../../../enums/row-type.enum';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
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
  selector: '[my-performance-table-row]',
  template: ''
})
class MockMyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;
  @Input() showContributionToVolume: boolean;
  @Input() showOpportunities: boolean;
  @Input() showEmptyLastColumn: boolean;
  @Input() viewType: SalesHierarchyViewType | ProductMetricsViewType;
  @Input() showX: boolean;
}

describe('MyPerformanceTableComponent', () => {
  let fixture: ComponentFixture<MyPerformanceTableComponent>;
  let componentInstance: MyPerformanceTableComponent;
  let tableHeaderRow: Array<string> = ['column1', 'column2', 'column3'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatRippleModule ],
      declarations: [
        BeerLoaderComponentMock,
        MyPerformanceTableComponent,
        MockMyPerformanceTableRowComponent,
        SortIndicatorComponent
      ],
      providers: [
        CalculatorService
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceTableComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.tableHeaderRow = tableHeaderRow;
    componentInstance.dateRange  = getDateRangeMock();
  });

  describe('setSortingcriteria', () => {

    it('should sort the data with one criterion', () => {
      const tableData = getMyPerformanceTableRowMock(2);

      componentInstance.tableData = tableData;
      const sortingCriteria = getSortingCriteriaMock(1);
      componentInstance.sortingCriteria = sortingCriteria;
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

    it('should sort the data with two criteria accordingly when alternate hierarchy is present', () => {
      let tableData = getMyPerformanceTableRowMock(3);
      tableData[0].descriptionRow0 = 'GEOGRAPHY';
      tableData[0].metricColumn0 = 1;
      tableData[1].descriptionRow0 = 'a';
      tableData[1].metricColumn0 = 0;
      tableData[2].descriptionRow0 = 'b';
      tableData[2].metricColumn0 = 2;
      componentInstance.tableData = tableData.slice();

      const sortingCriteria = [
        {
          columnType: ColumnType.descriptionRow0,
          ascending: false
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

      expect(rowComponent0.rowData).toBe(tableData[2]);
      expect(rowComponent1.rowData).toBe(tableData[1]);
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

  describe('getTableClasses', () => {
    describe('when viewType is one of SalesHierarchyViewType', () => {
      it('should return the classes depending on the input parameters', () => {
        componentInstance.loadingState = getLoadingStateMock();
        componentInstance.viewType = getSalesHierarchyViewTypeMock();

        const tableClass = componentInstance.getTableClasses();
        expect(tableClass).toEqual({
          [`view-type-${componentInstance.viewType}`]: true,
          [componentInstance.loadingState]: true
        });
      });
    });

    describe('when viewType is one of ProductMetricsViewType', () => {
      it('should return the classes depending on the input parameters', () => {
        componentInstance.loadingState = getLoadingStateMock();
        componentInstance.viewType = getProductMetricsViewTypeMock();

        const tableClass = componentInstance.getTableClasses();
        expect(tableClass).toEqual({
          [`view-type-${componentInstance.viewType}`]: true,
          [componentInstance.loadingState]: true
        });
      });
    });
  });

  describe('getTableBodyClasses', () => {
    it('should return the total-row-present class when total row is present', () => {
      const totalRowMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      const dismissableTotalRowMock: MyPerformanceTableRow = null;
      componentInstance.totalRow = totalRowMock;
      componentInstance.dismissableTotalRow = dismissableTotalRowMock;

      const tableBodyClass = componentInstance.getTableBodyClasses();
      expect(tableBodyClass).toBe('total-row-present');
    });

    it('should return the total-row-present class when dismissable total row is present', () => {
      const totalRowMock: MyPerformanceTableRow = null;
      const dismissableTotalRowMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      componentInstance.totalRow = totalRowMock;
      componentInstance.dismissableTotalRow = dismissableTotalRowMock;

      const tableBodyClass = componentInstance.getTableBodyClasses();
      expect(tableBodyClass).toBe('total-row-present');
    });

    it('should return the total-row-absent class when total row is absent', () => {
      const totalRowMock: MyPerformanceTableRow = null;
      const dismissableTotalRowMock: MyPerformanceTableRow = null;
      componentInstance.totalRow = totalRowMock;
      componentInstance.dismissableTotalRow = dismissableTotalRowMock;

      const tableBodyClass = componentInstance.getTableBodyClasses();
      expect(tableBodyClass).toBe('total-row-absent');
    });
  });

  describe('getColumnWidthClass', () => {
    it('should return two-right-columns-present when showing both CTV and Opps', () => {
      componentInstance.showContributionToVolume = true;
      componentInstance.showOpportunities = true;
      const cls = componentInstance.getColumnWidthClass();
      expect(cls).toEqual('two-right-columns-present');
    });

    it('should return one-right-column-present when showing only CTV', () => {
      componentInstance.showContributionToVolume = true;
      componentInstance.showOpportunities = false;
      const cls = componentInstance.getColumnWidthClass();
      expect(cls).toEqual('one-right-column-present');
    });

    it('should return one-right-column-present when showing only Opps', () => {
      componentInstance.showContributionToVolume = false;
      componentInstance.showOpportunities = true;
      const cls = componentInstance.getColumnWidthClass();
      expect(cls).toEqual('one-right-column-present');
    });

    it('should return empty string when showing neither CTV nor Opps', () => {
      componentInstance.showContributionToVolume = false;
      componentInstance.showOpportunities = false;
      const cls = componentInstance.getColumnWidthClass();
      expect(cls).toEqual('');
    });
  });

  describe('getSubHeaderClasses', () => {
    it('should return two-right-columns-present when showing both CTV and Opps and Total Row is not selected', () => {
      componentInstance.showContributionToVolume = true;
      componentInstance.showOpportunities = true;
      componentInstance.totalRow = null;
      const cls = componentInstance.getSubHeaderClasses();
      expect(cls).toEqual('two-right-columns-present');
    });

    it('should return two-right-columns-present no-sub-header-border when showing both CTV and Opps and Total Row is selected', () => {
      componentInstance.showContributionToVolume = true;
      componentInstance.showOpportunities = true;
      const totalRowMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      componentInstance.totalRow = totalRowMock;
      const cls = componentInstance.getSubHeaderClasses();
      expect(cls).toEqual('two-right-columns-present no-sub-header-border');
    });

  });

  describe('when calling onRowClicked', () => {
    let rowTypeMock: RowType = RowType.data;
    let indexMock: number;
    let myPerformanceTableRowMock: MyPerformanceTableRow;

    beforeEach(() => {
      indexMock = chance.natural();
      myPerformanceTableRowMock = getMyPerformanceTableRowMock(1)[0];
      spyOn(componentInstance.onElementClicked, 'emit');
    });

    it('should emit an event when the viewtype is accounts', () => {
      componentInstance.viewType = SalesHierarchyViewType.accounts;
      componentInstance.onRowClicked(rowTypeMock, indexMock, myPerformanceTableRowMock);
      expect(componentInstance.onElementClicked.emit).toHaveBeenCalledWith(
        {type: rowTypeMock, index: indexMock, row: myPerformanceTableRowMock});
    });

    it('should emit an event when the viewtype is people', () => {
      componentInstance.viewType = SalesHierarchyViewType.people;
      componentInstance.onRowClicked(rowTypeMock, indexMock, myPerformanceTableRowMock);
      expect(componentInstance.onElementClicked.emit).toHaveBeenCalledWith(
        {type: rowTypeMock, index: indexMock, row: myPerformanceTableRowMock});
    });

    it('should emit an event when the viewtype is rolegroups', () => {
      componentInstance.viewType = SalesHierarchyViewType.roleGroups;
      componentInstance.onRowClicked(rowTypeMock, indexMock, myPerformanceTableRowMock);
      expect(componentInstance.onElementClicked.emit).toHaveBeenCalledWith(
        {type: rowTypeMock, index: indexMock, row: myPerformanceTableRowMock});
    });

    it('should emit an event when the viewtype is distributors', () => {
      componentInstance.viewType = SalesHierarchyViewType.distributors;
      componentInstance.onRowClicked(rowTypeMock, indexMock, myPerformanceTableRowMock);
      expect(componentInstance.onElementClicked.emit).toHaveBeenCalledWith(
        {type: rowTypeMock, index: indexMock, row: myPerformanceTableRowMock});
    });

    it('should emit an event when the viewtype is subaccounts', () => {
      componentInstance.viewType = SalesHierarchyViewType.subAccounts;
      componentInstance.onRowClicked(rowTypeMock, indexMock, myPerformanceTableRowMock);
      expect(componentInstance.onElementClicked.emit).toHaveBeenCalledWith(
        {type: rowTypeMock, index: indexMock, row: myPerformanceTableRowMock});
    });
  });

  describe('when a row is clicked', () => {
    it('should call the event handler onRowClicked', () => {
      const onRowClickedSpy = spyOn(componentInstance, 'onRowClicked');
      spyOn(componentInstance, 'getSortStatus').and.callFake(() => SortStatus.ascending);
      componentInstance.tableData = getMyPerformanceTableRowMock(1);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('tbody tr').click();
      expect(onRowClickedSpy).toHaveBeenCalled();
    });
  });

  describe('getEntityRowClasses', () => {
    let rowData: MyPerformanceTableRow;
    let getColumnWidthClassSpy: jasmine.Spy;

    beforeEach(() => {
      rowData = getMyPerformanceTableRowMock(1)[0];
      rowData.performanceError = false;
      getColumnWidthClassSpy = spyOn(componentInstance, 'getColumnWidthClass').and.returnValue('');
    });

    it('should disable classes by default', () => {
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-sku': false,
        'selected-entity-row': false,
      });
    });

    it('should include column width class when value is returned from getColumnWidthClass', () => {
      const columnWidthClassMock = chance.string();
      getColumnWidthClassSpy.and.returnValue(columnWidthClassMock);
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-sku': false,
        'selected-entity-row': false,
        [columnWidthClassMock]: true
      });
    });

    it('should return an object with performance-error true when the row has a performanceError', () => {
      rowData.performanceError = true;
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': true,
        'selected-sku': false,
        'selected-entity-row': false,
      });
    });

    it('should return an object with selected-sku true when the row matches the selectedSkuPackageCode', () => {
      componentInstance.selectedSkuPackageCode = rowData.metadata.skuPackageCode;
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-sku': true,
        'selected-entity-row': false,
      });
    });

    it('should return an object with selected-entity-row true when the row matches the selectedSubaccountPackageCode', () => {
      componentInstance.selectedSubaccountCode = rowData.metadata.positionId;
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-sku': false,
        'selected-entity-row': true,
      });
    });

    it('should return an object with selected-entity-row false when the row has positionId but not same as selectedSubaccountcode', () => {
      componentInstance.selectedSubaccountCode = rowData.metadata.positionId + chance.character();
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-sku': false,
        'selected-entity-row': false,
      });
    });

    it('should return an object with selected-entity-row true when the row matches the selectedDistributorPackageCode', () => {
      componentInstance.selectedDistributorCode = rowData.metadata.positionId;
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-sku': false,
        'selected-entity-row': true,
      });
    });

    it('should return an object with selected-entity-row false when the row has positionId but not same as selectedDistributorcode', () => {
      componentInstance.selectedDistributorCode = rowData.metadata.positionId + chance.character();
      const classObject = componentInstance.getEntityRowClasses(rowData);
      expect(classObject).toEqual({
        'performance-error': false,
        'selected-sku': false,
        'selected-entity-row': false,
      });
    });
  });

  describe('getDismissableTotalRowClasses', () => {
    let getColumnWidthClassSpy: jasmine.Spy;

    beforeEach(() => {
      getColumnWidthClassSpy = spyOn(componentInstance, 'getColumnWidthClass').and.returnValue('');
    });

    it('should return selected true if there is a dismissableTotalRow but no selectedSkuPackageCode', () => {
      componentInstance.dismissableTotalRow = getMyPerformanceTableRowMock(1)[0];
      componentInstance.selectedSkuPackageCode = null;
      const classObject = componentInstance.getDismissableTotalRowClasses();
      expect(classObject).toEqual({
        'selected': true
      });
    });

    it('should return selected false if there is a dismissableTotalRow but there is also a selectedSkuPackageCode', () => {
      componentInstance.dismissableTotalRow = getMyPerformanceTableRowMock(1)[0];
      componentInstance.selectedSkuPackageCode = chance.string();
      const classObject = componentInstance.getDismissableTotalRowClasses();
      expect(classObject).toEqual({
        'selected': false
      });
    });

    it('should return selected false if there is no dismissableTotalRow', () => {
      componentInstance.selectedSkuPackageCode = chance.string();
      const classObject = componentInstance.getDismissableTotalRowClasses();
      expect(classObject).toEqual({
        'selected': false
      });
    });

    it('should include column width class when value is returned from getColumnWidthClass', () => {
      const columnWidthClassMock = chance.string();
      getColumnWidthClassSpy.and.returnValue(columnWidthClassMock);
      const classObject = componentInstance.getDismissableTotalRowClasses();
      expect(classObject).toEqual({
        'selected': false,
        [columnWidthClassMock]: true
      });
    });
  });

  describe('getTotalRowClasses', () => {
    let columnWidthClassMock: string;
    let getColumnWidthClassSpy: jasmine.Spy;

    beforeEach(() => {
      columnWidthClassMock = chance.string();
      getColumnWidthClassSpy = spyOn(componentInstance, 'getColumnWidthClass').and.returnValue(columnWidthClassMock);
      componentInstance.viewType = SalesHierarchyViewType.subAccounts;
    });

    describe('when viewtype is subaccounts', () => {
      describe('when selectedsubaccount has defined value', () => {
        it('should return true for deselected-total-row', () => {
          componentInstance.selectedSubaccountCode = chance.string();
          const classObject = componentInstance.getTotalRowClasses();
          expect(classObject).toEqual({
            'deselected-total-row': true,
            [columnWidthClassMock]: true
          });
        });
      });
    });

    describe('when viewtype is distributors', () => {
      describe('when selectedDistributor has defined value', () => {
        it('should return true for deselected-total-row', () => {
          componentInstance.selectedDistributorCode = chance.string();
          const classObject = componentInstance.getTotalRowClasses();
          expect(classObject).toEqual({
            'deselected-total-row': true,
            [columnWidthClassMock]: true
          });
        });
      });
    });

    describe('when viewtype is not subaccounts or distributors', () => {
      it('should return false for both properties', () => {
        componentInstance.viewType = SalesHierarchyViewType.roleGroups;
        componentInstance.selectedSubaccountCode = chance.string();
        const classObject = componentInstance.getTotalRowClasses();
        expect(classObject).toEqual({
          'deselected-total-row': false,
          [columnWidthClassMock]: true
        });
      });
    });

    describe('when selectedSubaccount is undefined', () => {
      it('should return false for both properties', () => {
        componentInstance.selectedSubaccountCode = undefined;
        const classObject = componentInstance.getTotalRowClasses();
        expect(classObject).toEqual({
          'deselected-total-row': false,
          [columnWidthClassMock]: true
        });
      });
    });

    describe('when selectedDistributor is undefined', () => {
      it('should return false for both properties', () => {
        componentInstance.selectedDistributorCode = undefined;
        const classObject = componentInstance.getTotalRowClasses();
        expect(classObject).toEqual({
          'deselected-total-row': false,
          [columnWidthClassMock]: true
        });
      });
    });
  });
});
