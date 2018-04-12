import * as Chance from 'chance';
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';

import { AppState } from '../../state/reducers/root.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import * as ListsActions from '../../state/actions//lists.action';
import { ListDetailComponent } from './list-detail.component';
import { CompassActionButtonComponent } from '../../shared/components/compass-action-button/compass-action-button.component';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListsState } from '../../state/reducers/lists.reducer';
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
  let listDetailMock: ListsState = {
    listSummary: {
      summaryStatus: ActionStatus.NotFetched,
      summaryData: {
        archived: false,
        description: null,
        id: null,
        name: null,
        closedOpportunities: null,
        totalOpportunities: null,
        numberOfAccounts: null,
        ownerFirstName: null,
        ownerLastName: null
      }
    },
    listStores: {
      storeStatus: ActionStatus.Fetching,
      stores: []
    }
  };

  const listsSubject: Subject<ListsState> = new Subject<ListsState>();

  const titleMock = {
    setTitle: jasmine.createSpy('setTitle')
  };

  const stateMock = {
    listsDetails: listDetailMock,
    current: {
      title: chance.string()
    },
    params: {
      id: chance.string()
    }
  };

  const storeMock = {
    select: jasmine.createSpy('select').and.returnValue(Observable.of(listDetailMock)),
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListDetailComponent,
        CompassActionButtonComponent,
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
        },
        {
          provide: Store,
          useValue: storeMock
        }
      ]
    });

    fixture = TestBed.createComponent(ListDetailComponent);
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();

    listsSubject.next(listDetailMock);
  });

  describe('ListDetailComponent initialization', () => {
    let testBed: TestBed;
    let store: Store<AppState>;

    beforeEach(() => {
      testBed = getTestBed();
      store = testBed.get(Store);
    });

    it('should call setTitle', () => {
      expect(titleMock.setTitle).toHaveBeenCalledWith(stateMock.current.title);
    });

    it('should call select with the right arguments', () => {
      storeMock.dispatch.calls.reset();
      storeMock.select.calls.reset();
      listsSubject.next(stateMock.listsDetails);
      componentInstance.ngOnInit();

      expect(storeMock.select.calls.count()).toBe(1);
      const selectorFunction = storeMock.select.calls.argsFor(0)[0];
      expect(selectorFunction(stateMock)).toBe(stateMock.listsDetails);
      expect(store.select).toHaveBeenCalled();
    });

    it('should dispatch actions for fetching stores and list headers', () => {
      storeMock.dispatch.calls.reset();
      componentInstance.ngOnInit();

      expect(storeMock.dispatch.calls.count()).toBe(2);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.FetchStoreDetails({
        listId : stateMock.params.id
      }));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ListsActions.FetchHeaderDetails({
        listId : stateMock.params.id
      }));
    });
  });
});
