import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';

import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { CalculatorService } from '../../services/calculator.service';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { getListOpportunitiesTableRowMock } from '../../models/list-opportunities/list-opportunities-table-row.model.mock';
import { getListPerformanceTableRowMock } from '../../models/list-performance/list-performance-table-row.model.mock';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListDetailComponent } from './list-detail.component';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import * as ListsActions from '../../state/actions/lists.action';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { SharedModule } from '../../shared/shared.module';
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

@Component({
  selector: 'list-opportunities-table',
  template: ''
})

class ListOpportunitiesTableComponentMock {
  @Input() sortingCriteria: Array<SortingCriteria>;
  @Input() tableData: Array<ListOpportunitiesTableRow>;
  @Input() tableHeaderRow: Array<string>;
  @Input() loadingState: boolean;
}

@Component({
  selector: 'lists-header',
  template: ''
})

class ListsHeaderComponentMock {
  @Input() summaryData: ListsSummary;
  @Output() manageButtonClicked= new EventEmitter();
  @Output() listsLinkClicked = new EventEmitter();
}

@Component({
  selector: 'lists-pagination',
  template: ''
})

class ListsPaginationComponentMock {
  @Input() tableDataSize: number;
  @Input() tabName: string;
  @Output() pageChangeClick = new EventEmitter();
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
    },
    listOpportunities: {
      opportunitiesStatus: ActionStatus.Fetching,
      opportunities: {}
    },
    performance: {
      podStatus: ActionStatus.NotFetched,
      pod: null,
      volumeStatus: ActionStatus.NotFetched,
      volume: null
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
        ListsHeaderComponentMock,
        ListOpportunitiesTableComponentMock,
        ListsPaginationComponentMock,
        ListPerformanceTableComponentMock
      ],
      providers: [
        CalculatorService,
        ListsTableTransformerService,
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
      ],
      imports: [
        SharedModule
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

    it('should dispatch actions for fetching stores, list headers, opportunities and list performance data', () => {
      storeMock.dispatch.calls.reset();
      componentInstance.ngOnInit();

      expect(storeMock.dispatch.calls.count()).toBe(5);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.FetchStoreDetails({
        listId : stateMock.params.id
      }));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ListsActions.FetchHeaderDetails({
        listId : stateMock.params.id
      }));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ListsActions.FetchOppsForList({
        listId : stateMock.params.id
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ListsActions.FetchListPerformanceVolume({
        listId : stateMock.params.id,
        performanceType: ListPerformanceType.Volume,
        beverageType: ListBeverageType.Beer,
        dateRangeCode: DateRangeTimePeriodValue.CYTDBDL
      }));
      expect(storeMock.dispatch.calls.argsFor(4)[0]).toEqual(new ListsActions.FetchListPerformancePOD({
        listId : stateMock.params.id,
        performanceType: ListPerformanceType.POD,
        beverageType: ListBeverageType.Beer,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL
      }));
    });
  });

  describe('when tabs are selected', () => {
    it('should set the selected tab', () => {
      componentInstance.tabSelectedClick({selectedTab: 'Performance'});
      expect(componentInstance.selectedTab).toBe('Performance');
    });
  });

  describe('when page is clicked on pagination', () => {
    it('should set page start, page end for opportunities tab', () => {
      componentInstance.selectedTab = 'Opportunities';
      componentInstance.opportunitiesTableData = getListOpportunitiesTableRowMock(300);
      spyOn(componentInstance.opportunitiesTableData, 'slice');
      componentInstance.handlePageClick({pageNumber: 5});
      expect(componentInstance.opportunitiesTableData.slice).toHaveBeenCalledWith(80, 100);
    });

    it('should slice the data for opportunities tab', () => {
      componentInstance.selectedTab = 'Opportunities';
      componentInstance.opportunitiesTableData = getListOpportunitiesTableRowMock(300);
      const expectedData = componentInstance.opportunitiesTableData.slice(80, 100);
      componentInstance.handlePageClick({pageNumber: 5});
      fixture.detectChanges();
      expect(componentInstance.opportunitiesTableSlicedData).toEqual(expectedData);
    });

    it('should set page start, page end for performance tab', () => {
      componentInstance.selectedTab = 'Performance';
      componentInstance.performanceTableData = getListPerformanceTableRowMock(300);
      spyOn(componentInstance.performanceTableData, 'slice');
      componentInstance.handlePageClick({pageNumber: 5});
      expect(componentInstance.performanceTableData.slice).toHaveBeenCalledWith(80, 100);
    });

    it('should slice the data for performance tab', () => {
      componentInstance.selectedTab = 'Performance';
      componentInstance.performanceTableData = getListPerformanceTableRowMock(300);
      const expectedData = componentInstance.performanceTableData.slice(80, 100);
      componentInstance.handlePageClick({pageNumber: 5});
      expect(componentInstance.slicedPerformanceTableData).toEqual(expectedData);
    });
  });
});
