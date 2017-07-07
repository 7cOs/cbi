import * as Chance from 'chance';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { MyPerformanceTableComponent, MyPerformanceTableRow, ColumnType, SortingCriteria } from './my-performance-table.component';

let chance = new Chance();

@Component({
  selector: 'my-performance-table-row',
  template: ''
})
class MockMyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;
}

function createRandomDataRows(length: number) {
  let rows: Array<MyPerformanceTableRow> = Array<MyPerformanceTableRow>();

  for (let i = 0 ; i < length ; i++) {
    rows.push({
      descriptionLine0: chance.string(),
      descriptionLine1: chance.string(),
      metricColumn0: chance.floating(),
      metricColumn1: chance.floating(),
      metricColumn2: chance.floating(),
      ctv: chance.natural()
    });
  }

  return rows;
}

const columnTypeValues = Object.keys(ColumnType)
  .map(key => ColumnType[key])
  .filter(value => typeof value === 'number');

function createRandomSortingCriteria(length: number) {
  let criteria: Array<SortingCriteria> = Array<SortingCriteria>();

  for (let i = 0 ; i < length ; i++) {
    criteria.push({
      columnType: columnTypeValues[chance.integer({min: 0, max: columnTypeValues.length - 1})],
      ascending: chance.bool()
    });
  }

  return criteria;
}

fdescribe('MyPerformanceTableComponent', () => {

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

  describe('setSortingCriterias', () => {

    it('should sort the data with one criterion', () => {
      const tableDataRows = createRandomDataRows(2);
      componentInstance.tableDataRows = tableDataRows;

      const sortingCriteriaMock = createRandomSortingCriteria(1);
      componentInstance.sortingCriteria = sortingCriteriaMock;
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

  });

});
