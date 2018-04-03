import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ListDetailComponent } from './list-detail.component';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { SortingCriteria } from '../../models/my-performance-table-sorting-criteria.model';

const chance = new Chance();

@Component({
  selector: 'list-performance-table',
  template: ''
})
class ListPerformanceTableComponentMock {
  @Input() sortingCriteria: Array<SortingCriteria>;
  @Input() tableData: Array<ListPerformanceTableRow>;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: ListPerformanceTableRow;
  @Input() loadingState: boolean;
}

describe('ListDetailComponent', () => {
  let fixture: ComponentFixture<ListDetailComponent>;
  let componentInstance: ListDetailComponent;

  const titleMock = {
    setTitle: jasmine.createSpy('setTitle')
  };

  const stateMock = {
    current: {
      title: chance.string()
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListDetailComponent,
        ListPerformanceTableComponentMock
      ],
      providers: [
        {
          provide: Title,
          useValue: titleMock
        },
        {
          provide: '$state',
          useValue: stateMock
        }
      ]
    });

    fixture = TestBed.createComponent(ListDetailComponent);
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ListDetailComponent initialization', () => {

    it('should call setTitle', () => {
      expect(titleMock.setTitle).toHaveBeenCalledWith(stateMock.current.title);
    });
  });
});
