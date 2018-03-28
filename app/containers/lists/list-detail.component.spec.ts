import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { ListDetailComponent } from './list-detail.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import { Subject } from 'rxjs/Subject';

const chance = new Chance();

describe('ListDetailComponent', () => {
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
 /*   let store: any;

    beforeEach(inject([ Store ],
      ( _store: any) => {
        store = _store;
      }));*/

    it('should call setTitle', () => {
      expect(titleMock.setTitle).toHaveBeenCalledWith(stateMock.current.title);
    });
  });
});
