import * as Chance from 'chance';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { ListDetailComponent } from './list-detail.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import { Subject } from 'rxjs/Subject';
import * as ListsActions from '../../state/actions//lists.action';

const chance = new Chance();

fdescribe('ListDetailComponent', () => {
  let fixture: ComponentFixture<ListDetailComponent>;
  let componentInstance: ListDetailComponent;
  let listDetailMock: ListsState = {
    status: ActionStatus.Fetching,
    headerInfoStatus: ActionStatus.NotFetched,
    stores: []
  };

  const listsSubject: Subject<ListsState> = new Subject<ListsState>();

  const titleMock = {
    setTitle: jasmine.createSpy('setTitle')
  };

  const stateMock = {
    listDetails: listDetailMock,
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
        ListDetailComponent
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

    let store: any;
    beforeEach(inject([ Store ],
      (_store: any) => {
        store = _store;
      }));

    it('should call setTitle', () => {
      expect(titleMock.setTitle).toHaveBeenCalledWith(stateMock.current.title);
    });

    fit('should call select with the right arguments', () => {
      storeMock.dispatch.calls.reset();
      storeMock.select.calls.reset();
      listsSubject.next(stateMock.listDetails);
      componentInstance.ngOnInit();

      expect(storeMock.select.calls.count()).toBe(1);
      const functionPassToSelectCall0 = storeMock.select.calls.argsFor(0)[0];
      console.log(functionPassToSelectCall0);
      console.log(functionPassToSelectCall0(stateMock));
      expect(functionPassToSelectCall0(stateMock)).toBe(stateMock.listDetails);
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
