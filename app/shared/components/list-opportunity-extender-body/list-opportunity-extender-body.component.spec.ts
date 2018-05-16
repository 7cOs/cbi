import * as Chance from 'chance';
import {  ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import { ActionStatus } from '../../../enums/action-status.enum';
import { AppState } from '../../../state/reducers/root.reducer';
import { getOpportunitiesByStoreMock } from '../../../models/lists/opportunities-by-store.model.mock';
import { ListOpportunityExtenderBodyComponent } from './list-opportunity-extender-body.component';
import { ListsState } from '../../../state/reducers/lists.reducer';
import { OpportunityTypeLabel } from '../../../enums/list-opportunities/list-opportunity-type-label.enum';
import { OpportunitiesByStore } from '../../../models/lists/opportunities-by-store.model';
import { ListsOpportunities } from '../../../models/lists/lists-opportunities.model';

const chance = new Chance();
describe('Team Performance Opportunities Extender Body', () => {
  let fixture: ComponentFixture<ListOpportunityExtenderBodyComponent>;
  let componentInstance: ListOpportunityExtenderBodyComponent;
  let opportunitySelectedMock: string;
  let unversionedStoreIdMock: string;

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
        ownerLastName: null,
        collaborators: [],
        ownerId: null,
        type: null,
        collaboratorType: null,
        category: null
      }
    },
    listStores: {
      storeStatus: ActionStatus.Fetching,
      stores: []
    },
    listOpportunities: {
      opportunitiesStatus: ActionStatus.Fetching,
      opportunities: getOpportunitiesByStoreMock()
    },
    performance: {
      podStatus: ActionStatus.NotFetched,
      pod: null,
      volumeStatus: ActionStatus.NotFetched,
      volume: null
    }
  };

  const listsSubject: Subject<ListsState> = new Subject<ListsState>();

  const stateMock = {
    listsDetails: listDetailMock
  };

  const storeMock = {
    select: jasmine.createSpy('select').and.returnValue(Observable.of(listDetailMock))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListOpportunityExtenderBodyComponent
      ],
      providers: [
        ListOpportunityExtenderBodyComponent,
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

  fixture = TestBed.createComponent(ListOpportunityExtenderBodyComponent);
  componentInstance = fixture.componentInstance;

  opportunitySelectedMock = chance.string();
  unversionedStoreIdMock = chance.string();

  listsSubject.next(listDetailMock);
  });

  describe('ListOpportunityExtenderBodyComponent initialization', () => {
    let testBed: TestBed;
    let store: Store<AppState>;

    beforeEach(() => {
      testBed = getTestBed();
      store = testBed.get(Store);
      fixture.detectChanges();
    });

    it('should call select with the right arguments', () => {
      storeMock.select.calls.reset();
      listsSubject.next(stateMock.listsDetails);
      componentInstance.ngOnInit();
      fixture.detectChanges();

      expect(storeMock.select.calls.count()).toBe(1);
      const selectorFunction = storeMock.select.calls.argsFor(0)[0];
      expect(selectorFunction(stateMock)).toBe(stateMock.listsDetails);
      expect(store.select).toHaveBeenCalled();
    });

    it('should call the method setExtenderBodyFileds', () => {
      spyOn(componentInstance, 'setExtenderBodyFields').and.callThrough();
      componentInstance.ngOnChanges();
      fixture.detectChanges();

      expect(componentInstance.setExtenderBodyFields).toHaveBeenCalled();
    });
  });

  describe('setExtenderBodyFields', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('Should pass in fields correctly from opportunities object', () => {
      const oppsGroupedByStore: OpportunitiesByStore = getOpportunitiesByStoreMock();
      const opportunityDetailsMock: ListsOpportunities = oppsGroupedByStore[Object.keys(oppsGroupedByStore)[0]][0];

      componentInstance.unversionedStoreId = Object.keys(oppsGroupedByStore)[0];
      componentInstance.opportunitySelected = opportunityDetailsMock.id;
      componentInstance.setExtenderBodyFields(oppsGroupedByStore);
      fixture.detectChanges();

      expect(componentInstance.opportunityDetails).toBe(opportunityDetailsMock);
      expect(componentInstance.opportunityType).toBe(OpportunityTypeLabel[opportunityDetailsMock.type]);
    });
  });
});
