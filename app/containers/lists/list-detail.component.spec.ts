import { By } from '@angular/platform-browser';
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
import { CompassSelectComponent } from '../../shared/components/compass-select/compass-select.component';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { getListOpportunitiesTableRowMock } from '../../models/list-opportunities/list-opportunities-table-row.model.mock';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListDetailComponent, PageChangeData } from './list-detail.component';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import * as ListsActions from '../../state/actions/lists.action';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListTableDrawerRow } from '../../models/lists/list-table-drawer-row.model';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
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
  @Input() pageChangeData: PageChangeData;
  @Input() totalRow: ListPerformanceTableRow;
  @Input() loadingState: boolean;
  @Output() paginationReset = new EventEmitter();
}

@Component({
  selector: 'list-opportunities-table',
  template: ''
})

class ListOpportunitiesTableComponentMock {
  @Input() sortingCriteria: Array<SortingCriteria>;
  @Input() tableData: Array<ListOpportunitiesTableRow>;
  @Input() pageChangeData: PageChangeData;
  @Input() tableHeaderRow: Array<string>;
  @Input() loadingState: boolean;
  @Input() oppStatusSelected: OpportunityStatus;
  @Output() paginationReset = new EventEmitter();
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
  @Input() paginationReset: Event;
  @Output() pageChangeClick = new EventEmitter();
}

@Component({
  selector: 'list-performance-summary',
  template: ''
})
class ListPerformanceSummaryComponentMock {
  @Input() depletionsTotal: number;
  @Input() depletionsVsYA: number;
  @Input() distributionsTotal: number;
  @Input() distributionsVsYA: number;
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
        ListPerformanceTableComponentMock,
        ListPerformanceSummaryComponentMock
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

  describe('when the Performance tab is clicked', () => {
    let opportunitiesTableData: ListOpportunitiesTableRow[];

    beforeEach(() => {
      opportunitiesTableData = getListOpportunitiesTableRowMock(10);

      componentInstance.opportunitiesTableData = opportunitiesTableData;
      fixture.detectChanges();
    });

    it('should set every opportunities table and expanded table row checked/expanded fields to false', () => {
      componentInstance.opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        expect(tableRow.checked).toBe(false);
        expect(tableRow.expanded).toBe(false);

        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow) => {
          expect(oppRow.checked).toBe(false);
        });
      });

      componentInstance.opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        tableRow.checked = true;
        tableRow.expanded = true;

        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow) => {
          oppRow.checked = true;
        });
      });
      fixture.detectChanges();

      fixture.debugElement.queryAll(By.css('.compass-tab'))[0].triggerEventHandler('click', null);
      fixture.detectChanges();

      componentInstance.opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        expect(tableRow.checked).toBe(false);
        expect(tableRow.expanded).toBe(false);

        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow) => {
          expect(oppRow.checked).toBe(false);
        });
      });
    });
  });

  describe('Outputs', () => {
    it('should call "next" function click event is received', () => {
      spyOn(componentInstance.paginationReset, 'next');
      componentInstance.handlePaginationReset();
      expect(componentInstance.paginationReset.next).toHaveBeenCalled();
    });

    it('should set the active tab and call pagination reset function when lists tab are clicked', () => {
      componentInstance.activeTab = 'Performance';
      spyOn(componentInstance.paginationReset, 'next');
      componentInstance.onTabClicked('Opportunities');
      expect(componentInstance.selectedTab).toBe('Opportunities');
      expect(componentInstance.activeTab).toBe('Opportunities');
      expect(componentInstance.paginationReset.next).toHaveBeenCalled();
    });
  });

  describe('Compass Select dropdown changes', () => {

    it('should trigger opportunityStatusSelected method when Opportunity status dropdown emits an event', () => {
      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(CompassSelectComponent));
      const oppStatusCompassSelect = mockSelectComponents[0].injector.get(CompassSelectComponent) as CompassSelectComponent;
      spyOn(componentInstance, 'opportunityStatusSelected');
      oppStatusCompassSelect.onOptionSelected.emit(OpportunityStatus.all);
      fixture.detectChanges();

      expect(componentInstance.opportunityStatusSelected).toHaveBeenCalled();
      expect(componentInstance.opportunityStatusSelected).toHaveBeenCalledWith(OpportunityStatus.all);
      expect(componentInstance.oppStatusSelected).toBe(OpportunityStatus.all);
    });
  });

  describe('[Method] filterOpportunitiesByStatus', () => {
    let opportunitiesTableData: ListOpportunitiesTableRow[];

    beforeEach(() => {
      opportunitiesTableData = getListOpportunitiesTableRowMock(3);

      componentInstance.opportunitiesTableData = opportunitiesTableData;
      fixture.detectChanges();
    });

    it('Should return empty array when there are no closed opps and opportunity status is closed', () => {
      opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow) => {
        const totalOpps = tableRow.opportunities.length;
        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow, oppIndex: number) => {
          oppRow.status = oppIndex < totalOpps / 2 ? OpportunityStatus.targeted : OpportunityStatus.inactive;
        });
      });
      fixture.detectChanges();
      expect(componentInstance.filterOpportunitiesByStatus(OpportunityStatus.closed, opportunitiesTableData)).toEqual([]);
    });

    it('Should return stores count to be 1 when there is only one store with closed opps and opportunity status is closed', () => {
      let expectedOpps: ListOpportunitiesTableRow[];
      opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow, storeIndex: number) => {
        const totalOpps = tableRow.opportunities.length;
        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow, oppIndex: number) => {
          if (storeIndex <= 1)
            oppRow.status = oppIndex < totalOpps / 2 ? OpportunityStatus.targeted : OpportunityStatus.inactive;
          else
            oppRow.status = oppIndex < totalOpps / 2 ? OpportunityStatus.targeted : OpportunityStatus.closed;
        });
      });
      fixture.detectChanges();
      expectedOpps = JSON.parse(JSON.stringify(opportunitiesTableData));
      expectedOpps[2].opportunities = expectedOpps[2].opportunities.filter(
        (opp: ListTableDrawerRow) =>  opp.status === OpportunityStatus.closed
      );
      expectedOpps[2].opportunitiesColumn = expectedOpps[2].opportunities.length;
      fixture.detectChanges();

      expect(componentInstance.filterOpportunitiesByStatus(OpportunityStatus.closed, opportunitiesTableData).length).toEqual(1);
      expect(componentInstance.filterOpportunitiesByStatus(OpportunityStatus.closed, opportunitiesTableData)).toEqual([expectedOpps[2]]);
    });

    it('Should return stores count to be 2 when there are 2 stores with one only inactive and other both', () => {
      opportunitiesTableData.forEach((tableRow: ListOpportunitiesTableRow, storeIndex: number) => {
        const totalOpps = tableRow.opportunities.length;
        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow, oppIndex: number) => {
          if (storeIndex === 0)
            oppRow.status = oppIndex < totalOpps / 2 ? OpportunityStatus.targeted : OpportunityStatus.inactive;
          else if (storeIndex === 1)
            oppRow.status = OpportunityStatus.inactive;
          else if (storeIndex === 2)
          oppRow.status = OpportunityStatus.closed;
        });
      });

      fixture.detectChanges();

      expect(componentInstance.filterOpportunitiesByStatus(OpportunityStatus.targeted, opportunitiesTableData).length).toEqual(2);
    });
  });
});
