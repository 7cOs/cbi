import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';

import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { CalculatorService } from '../../services/calculator.service';
import { CompassActionModalOutputs } from '../../models/compass-action-modal-outputs.model';
import { CompassManageListModalEvent } from '../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalOutput }from '../../models/compass-manage-list-modal-output.model';
import { CompassSelectComponent } from '../../shared/components/compass-select/compass-select.component';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { getListOpportunitiesTableRowMock } from '../../models/list-opportunities/list-opportunities-table-row.model.mock';
import { getListPerformanceTableRowMock } from '../../models/list-performance/list-performance-table-row.model.mock';
import { getListsSummaryMock } from '../../models/lists/lists-header.model.mock';
import { getListOpportunitiesMock } from '../../models/lists/lists-opportunities.model.mock';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListDetailComponent, PageChangeData } from './list-detail.component';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import * as ListsActions from '../../state/actions/lists.action';
import { ListSelectionType } from '../../enums/lists/list-selection-type.enum';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListStoresDownloadCSV } from '../../models/lists/list-stores-download-csv.model';
import { ListOpportunitiesDownloadCSV } from '../../models/lists/list-opportunities-download-csv.model';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListTableDrawerRow } from '../../models/lists/list-table-drawer-row.model';
import { OpportunitiesByStore } from '../../models/lists/opportunities-by-store.model';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { SharedModule } from '../../shared/shared.module';
import { SortingCriteria } from '../../models/my-performance-table-sorting-criteria.model';
import { AnalyticsService } from '../../services/analytics.service';

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
  @Input() sortReset: Event;
  @Input() paginationReset: Event;
  @Output() onPaginationReset = new EventEmitter();
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
  @Input() sortReset: Event;
  @Input() paginationReset: Event;
  @Output() onPaginationReset = new EventEmitter();
}

@Component({
  selector: 'lists-header',
  template: ''
})
class ListsHeaderComponentMock {
  @Input() summaryData: ListsSummary;
  @Output() manageButtonClicked = new EventEmitter();
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
  let testBed: TestBed;
  let store: Store<AppState>;
  let $state: any;
  let fixture: ComponentFixture<ListDetailComponent>;
  let componentInstance: ListDetailComponent;

  let listDetailMock: ListsState = {
    manageListStatus: ActionStatus.NotFetched,
    copyStatus: ActionStatus.NotFetched,
    allLists: {
      status: ActionStatus.NotFetched,
      owned: [],
      sharedWithMe: [],
      archived: []
    },
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
        collaborators: null,
        ownerId: null,
        collaboratorType: null,
        category: null,
        type: null
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
      id: chance.string(),
      listId: chance.string()
    },
    go: jasmine.createSpy('go')
  };

  const toastServiceMock = {
    showToast: jasmine.createSpy('showToast')
  };

  const storeMock = {
    select: jasmine.createSpy('select').and.returnValue(Observable.of(listDetailMock)),
    dispatch: jasmine.createSpy('dispatch')
  };

  const userMock = {
    model: {
      currentUser: {
        positionId: chance.string(),
        employeeId: chance.string(),
        firstName: chance.string(),
        lastName: chance.string()
      }
    }
  };

  const analyticsServiceMock = jasmine.createSpyObj(['trackEvent']);

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
        DecimalPipe,
        UpperCasePipe,
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
        },
        {
          provide: 'userService',
          useValue: userMock
        },
        {
          provide: 'toastService',
          useValue: toastServiceMock
        },
        {
          provide: AnalyticsService,
          useValue: analyticsServiceMock
        }
      ],
      imports: [
        SharedModule
      ]
    });

    testBed = getTestBed();
    store = testBed.get(Store);
    $state = testBed.get('$state');
    fixture = TestBed.createComponent(ListDetailComponent);
    componentInstance = fixture.componentInstance;

    listsSubject.next(listDetailMock);
    fixture.detectChanges();
  });

  afterEach(() => {
    stateMock.go.calls.reset();
  });

  describe('ListDetailComponent initialization', () => {
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
      componentInstance.currentUser.employeeId = userMock.model.currentUser.employeeId;
      componentInstance.ngOnInit();

      expect(storeMock.dispatch.calls.count()).toBe(6);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.FetchStoreDetails({
        listId: stateMock.params.id
      }));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ListsActions.FetchHeaderDetails({
        listId: stateMock.params.id
      }));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ListsActions.FetchOppsForList({
        listId: stateMock.params.id
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ListsActions.FetchListPerformanceVolume({
        listId: stateMock.params.id,
        performanceType: ListPerformanceType.Volume,
        beverageType: ListBeverageType.Beer,
        dateRangeCode: DateRangeTimePeriodValue.CYTDBDL
      }));
      expect(storeMock.dispatch.calls.argsFor(4)[0]).toEqual(new ListsActions.FetchListPerformancePOD({
        listId: stateMock.params.id,
        performanceType: ListPerformanceType.POD,
        beverageType: ListBeverageType.Beer,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL
      }));
      expect(storeMock.dispatch.calls.argsFor(5)[0]).toEqual(new ListsActions.FetchLists({
        currentUserEmployeeID: componentInstance.currentUser.employeeId
      }));
    });
  });

  describe('when the Performance tab is clicked', () => {
    let opportunitiesTableData: ListOpportunitiesTableRow[];
    let performanceTableData: ListPerformanceTableRow[];

    beforeEach(() => {
      opportunitiesTableData = getListOpportunitiesTableRowMock(10);
      performanceTableData = getListPerformanceTableRowMock(10);

      componentInstance.opportunitiesTableData = opportunitiesTableData;
      componentInstance.performanceTableData = performanceTableData;
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

  describe('when the Opportunity tab is clicked', () => {
    let opportunitiesTableData: ListOpportunitiesTableRow[];
    let performanceTableData: ListPerformanceTableRow[];

    beforeEach(() => {
      opportunitiesTableData = getListOpportunitiesTableRowMock(10);
      performanceTableData = getListPerformanceTableRowMock(10);

      componentInstance.opportunitiesTableData = opportunitiesTableData;
      componentInstance.performanceTableData = performanceTableData;
      fixture.detectChanges();
    });

    it('should set every performance table row checked fields to false', () => {
      componentInstance.performanceTableData.forEach((tableRow: ListPerformanceTableRow) => {
        expect(tableRow.checked).toBe(false);
      });

      componentInstance.performanceTableData.forEach((tableRow: ListPerformanceTableRow) => {
        tableRow.checked = true;
      });
      fixture.detectChanges();

      fixture.debugElement.queryAll(By.css('.compass-tab'))[1].triggerEventHandler('click', null);
      fixture.detectChanges();

      componentInstance.performanceTableData.forEach((tableRow: ListPerformanceTableRow) => {
        expect(tableRow.checked).toBe(false);
      });
    });
  });

  describe('Outputs', () => {
    let performanceTableData: ListPerformanceTableRow[];

    beforeEach(() => {
      performanceTableData = getListPerformanceTableRowMock(10);

      componentInstance.performanceTableData = performanceTableData;
      fixture.detectChanges();
    });

    it('should call "next" function click event is received', () => {
      spyOn(componentInstance.paginationReset, 'next');
      componentInstance.handlePaginationReset();
      expect(componentInstance.paginationReset.next).toHaveBeenCalled();
    });

    it('should set the active tab and call pagination reset function when lists tab are clicked', () => {
      componentInstance.activeTab = 'Performance';
      spyOn(componentInstance.paginationReset, 'next');
      spyOn(componentInstance.sortReset, 'next');
      componentInstance.onTabClicked('Opportunities');
      expect(componentInstance.selectedTab).toBe('Opportunities');
      expect(componentInstance.activeTab).toBe('Opportunities');
      expect(componentInstance.paginationReset.next).toHaveBeenCalled();
      expect(componentInstance.sortReset.next).toHaveBeenCalled();
      expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
        'Lists - Shared With Me', 'View Opportunities', componentInstance.listSummary.id);
    });
  });

  describe('When the opportunity status filter is changed', () => {

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

    it('Should return stores with closed opps and opportunity status is closed', () => {
      const expectedOpps: ListOpportunitiesTableRow[] = componentInstance.filterOpportunitiesByStatus(
        OpportunityStatus.closed,
        opportunitiesTableData
      );

      fixture.detectChanges();
      expectedOpps.forEach((tableRow: ListOpportunitiesTableRow) => {
        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow) => {
          expect(oppRow.status).toEqual(OpportunityStatus.closed);
        });
      });
    });

    it('Should return stores that have opps as either targeted or inactive when filter is targeted', () => {
      const expectedOpps: ListOpportunitiesTableRow[] = componentInstance.filterOpportunitiesByStatus(
        OpportunityStatus.targeted,
        opportunitiesTableData
      );

      fixture.detectChanges();
      expectedOpps.forEach((tableRow: ListOpportunitiesTableRow) => {
        tableRow.opportunities.forEach((oppRow: ListTableDrawerRow) => {
          expect([OpportunityStatus.targeted, OpportunityStatus.inactive]).toContain(oppRow.status);
        });
      });
    });
  });

  describe('handleManageModalEvent', () => {
    let manageModalOutputMock: CompassManageListModalOutput;

    beforeEach(() => {
      manageModalOutputMock = {
        type: CompassManageListModalEvent.Save,
        listSummary: getListsSummaryMock(),
        selectedEmployeeId: chance.string()
      };

      storeMock.dispatch.calls.reset();
    });

    afterEach(() => {
      storeMock.dispatch.calls.reset();
    });

    it('should dispatch a PatchList action with the listSummary data when the CompassManageListModalEvent type is Save', () => {
      manageModalOutputMock.type = CompassManageListModalEvent.Save;

      componentInstance.handleManageModalEvent(manageModalOutputMock);

      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.PatchList(manageModalOutputMock.listSummary));
    });

    it('should dispatch a DeleteList action with the list id when the CompassManageListModalEvent type is Delete', () => {
      manageModalOutputMock.type = CompassManageListModalEvent.Delete;

      componentInstance.handleManageModalEvent(manageModalOutputMock);

      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.DeleteList(manageModalOutputMock.listSummary.id));
    });

    it('should dispatch a ArchiveList action with the listSummary data when the CompassManageListModalEvent type is Archive', () => {
      manageModalOutputMock.type = CompassManageListModalEvent.Archive;

      componentInstance.handleManageModalEvent(manageModalOutputMock);

      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.ArchiveList(manageModalOutputMock.listSummary));
    });

    it('should dispatch a LeaveList action with the listSummary data and id of the current user when the'
    + ' CompassManageListModalEvent type is Leave', () => {
      manageModalOutputMock.type = CompassManageListModalEvent.Leave;

      componentInstance.handleManageModalEvent(manageModalOutputMock);

      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.LeaveList({
        currentUserEmployeeId: componentInstance.currentUser.employeeId,
        listSummary: manageModalOutputMock.listSummary
      }));
    });

    it('should dispatch a TransferListOwnership action with the listSummary data and id of the selected collaborator when the'
    + ' CompassManageListModalEvent type is Transfer_Ownership', () => {
      manageModalOutputMock.type = CompassManageListModalEvent.Transfer_Ownership;

      componentInstance.handleManageModalEvent(manageModalOutputMock);

      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ListsActions.TransferListOwnership({
        newOwnerEmployeeId: manageModalOutputMock.selectedEmployeeId,
        listSummary: manageModalOutputMock.listSummary
      }));
    });
  });

  describe('[Method] modalDownloadClicked', () => {
    let actionModalDownloadOutputMock: CompassActionModalOutputs;
    let opportunitiesTableData: ListOpportunitiesTableRow[];
    let performanceTableData: ListPerformanceTableRow[];
    const storesOnlyDownloadColumns = 11;
    const oppsDownloadColumns = 16;
    let groupedOppsByStoreMock: OpportunitiesByStore = {};

    beforeEach(() => {
      opportunitiesTableData = getListOpportunitiesTableRowMock(10);
      performanceTableData = getListPerformanceTableRowMock(10);

      opportunitiesTableData.forEach((storeRow: ListOpportunitiesTableRow) => {
        groupedOppsByStoreMock[storeRow.unversionedStoreId] = getListOpportunitiesMock();
      });
    });

    it('should only have store related columns for Download when StoreOnly is selected', () => {
      actionModalDownloadOutputMock = {
        radioOptionSelected: ListSelectionType.Stores,
        dropdownOptionSelected: null
      };
      componentInstance.selectedTab = 'Performance';
      componentInstance.performanceTableData = performanceTableData;
      componentInstance.filteredOpportunitiesTableData = opportunitiesTableData;
      fixture.detectChanges();

      const returnedValue = componentInstance.modalDownloadClicked(actionModalDownloadOutputMock);
      expect(returnedValue).not.toBe(undefined);
      expect(returnedValue.length).toEqual(performanceTableData.length);
      returnedValue.forEach((storeRow: ListStoresDownloadCSV) => {
        expect(Object.keys(storeRow).length).toEqual(storesOnlyDownloadColumns);
      });
    });

    it('should have both stores and opps related columns for Download when Opportunities are selected', () => {
      actionModalDownloadOutputMock = {
        radioOptionSelected: ListSelectionType.Opportunities,
        dropdownOptionSelected: null
      };
      componentInstance.selectedTab = 'Opportunities';
      componentInstance.performanceTableData = performanceTableData;
      componentInstance.filteredOpportunitiesTableData = opportunitiesTableData;
      fixture.detectChanges();

      componentInstance.groupedOppsByStore = groupedOppsByStoreMock;
      const returnedValue = componentInstance.modalDownloadClicked(actionModalDownloadOutputMock);
      expect(returnedValue).not.toBe(undefined);
      returnedValue.forEach((storeRow: ListOpportunitiesDownloadCSV) => {
        expect(Object.keys(storeRow).length).toEqual(oppsDownloadColumns);
      });
    });

    it('should have only closed status records for Download when filter selected is closed', () => {
      actionModalDownloadOutputMock = {
        radioOptionSelected: ListSelectionType.Opportunities,
        dropdownOptionSelected: null
      };
      componentInstance.selectedTab = 'Opportunities';
      componentInstance.performanceTableData = performanceTableData;
      componentInstance.filteredOpportunitiesTableData = opportunitiesTableData;
      componentInstance.oppStatusSelected = OpportunityStatus.closed;
      fixture.detectChanges();

      componentInstance.groupedOppsByStore = groupedOppsByStoreMock;
      const returnedValue = componentInstance.modalDownloadClicked(actionModalDownloadOutputMock);
      expect(returnedValue).not.toBe(undefined);
      returnedValue.forEach((storeRow: ListOpportunitiesDownloadCSV) => {
        expect(storeRow.opportunityStatus.toLowerCase()).toEqual(OpportunityStatus.closed);
      });
    });

    it('should have only targeted and inactive status records for Download when filter selected is targeted', () => {
      actionModalDownloadOutputMock = {
        radioOptionSelected: ListSelectionType.Opportunities,
        dropdownOptionSelected: null
      };
      componentInstance.selectedTab = 'Opportunities';
      componentInstance.performanceTableData = performanceTableData;
      componentInstance.filteredOpportunitiesTableData = opportunitiesTableData;
      componentInstance.oppStatusSelected = OpportunityStatus.targeted;
      fixture.detectChanges();

      componentInstance.groupedOppsByStore = groupedOppsByStoreMock;
      const returnedValue = componentInstance.modalDownloadClicked(actionModalDownloadOutputMock);
      expect(returnedValue).not.toBe(undefined);
      returnedValue.forEach((storeRow: ListOpportunitiesDownloadCSV) => {
        expect([OpportunityStatus.targeted, OpportunityStatus.inactive]).toMatch(storeRow.opportunityStatus.toLowerCase());
      });
    });
  });

  describe('handleManageListStatus', () => {

    beforeEach(() => {
      componentInstance.showManageListLoader = false;
    });

    it('should set the component`s showManageListLoader variable to false when the passed in ActionStatus is NotFetched', () => {
      expect(componentInstance.showManageListLoader).toBe(false);
      componentInstance.handleManageListStatus(ActionStatus.NotFetched);
      expect(componentInstance.showManageListLoader).toBe(false);
    });

    it('should set the component`s showManageListLoader variable to true when the passed in ActionStatus is Fetching', () => {
      expect(componentInstance.showManageListLoader).toBe(false);
      componentInstance.handleManageListStatus(ActionStatus.Fetching);
      expect(componentInstance.showManageListLoader).toBe(true);
    });

    it('should set the component`s showManageListLoader variable to false when the passed in ActionStatus is Fetched', () => {
      expect(componentInstance.showManageListLoader).toBe(false);
      componentInstance.handleManageListStatus(ActionStatus.Fetched);
      expect(componentInstance.showManageListLoader).toBe(false);
    });

    it('should change the state to the lists page when the passed in ActionStatus is Fetched', () => {
      componentInstance.handleManageListStatus(ActionStatus.NotFetched);
      expect($state.go).not.toHaveBeenCalled();

      componentInstance.handleManageListStatus(ActionStatus.Fetching);
      expect($state.go).not.toHaveBeenCalled();

      componentInstance.handleManageListStatus(ActionStatus.Fetched);
      expect($state.go).toHaveBeenCalledWith('lists');
    });
  });

  describe('CopyToLists', () => {

    describe('Copy Opportunities To Lists', () => {
      let opportunitiesTableData: ListOpportunitiesTableRow[];
      let modalOutputMock: CompassActionModalOutputs, checkedEntitiesMock: { opportunityId: string }[];
      beforeEach(() => {
        modalOutputMock = {
          radioOptionSelected: chance.string(),
          dropdownOptionSelected: chance.string()
        };
        opportunitiesTableData = getListOpportunitiesTableRowMock(3);
        opportunitiesTableData[0].opportunities[0].checked = true;
        componentInstance.opportunitiesTableData = opportunitiesTableData;
        checkedEntitiesMock = [{opportunityId: opportunitiesTableData[0].opportunities[0].id}];
        componentInstance.selectedTab = componentInstance.opportunitiesTabTitle;
        fixture.detectChanges();
      });

      it('should filter the checked opportunities and dispatch action for copy to List when handleCopyModalEvent is called', () => {
        storeMock.dispatch.calls.reset();
        componentInstance.handleCopyModalEvent(modalOutputMock, checkedEntitiesMock);

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new ListsActions.CopyOppsToList({
            listId: modalOutputMock.dropdownOptionSelected,
            ids: checkedEntitiesMock
          }));
      });
    });

    describe('Copy Stores To Lists', () => {
      let performanceTableData: ListPerformanceTableRow[];
      let modalOutputMock: CompassActionModalOutputs, checkedEntitiesMock: string[];
      beforeEach(() => {
        modalOutputMock = {
          radioOptionSelected: chance.string(),
          dropdownOptionSelected: chance.string()
        };
        testBed = getTestBed();
        store = testBed.get(Store);
        performanceTableData = getListPerformanceTableRowMock(3);
        performanceTableData[0].checked = performanceTableData[1].checked = true;

        componentInstance.performanceTableData = performanceTableData;
        checkedEntitiesMock = [performanceTableData[0].unversionedStoreId, performanceTableData[1].unversionedStoreId];
        componentInstance.selectedTab = componentInstance.performanceTabTitle;
        fixture.detectChanges();
      });

      it('should filter the checked stores and dispatch action for copy to List when handleCopyModalEvent is called', () => {
        storeMock.dispatch.calls.reset();
        componentInstance.handleCopyModalEvent(modalOutputMock, checkedEntitiesMock);

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new ListsActions.CopyStoresToList({
            listId: modalOutputMock.dropdownOptionSelected,
            id: performanceTableData[0].unversionedStoreId
          }));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
          new ListsActions.CopyStoresToList({
            listId: modalOutputMock.dropdownOptionSelected,
            id: performanceTableData[1].unversionedStoreId
          }));
      });
    });

  });

  describe('[Method] removeSelectedOpportunities', () => {
    let opportunitiesTableData: ListOpportunitiesTableRow[];
    beforeEach(() => {
      opportunitiesTableData = getListOpportunitiesTableRowMock(3);
      opportunitiesTableData[0].opportunities[0].checked = true;
      componentInstance.opportunitiesTableData = opportunitiesTableData;
      fixture.detectChanges();
    });
    it('Should filter out all selected opportunities and call the removal action', () => {
      storeMock.dispatch.calls.reset();
      componentInstance.removeSelectedOpportunities();
      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new ListsActions.RemoveOppFromList({listId: stateMock.listsDetails.listSummary.summaryData.id,
          oppId: opportunitiesTableData[0].opportunities[0].id}));
    });
  });

  describe('[Method] removeSelectedStores', () => {
    let performanceTableData: ListPerformanceTableRow[];
    beforeEach(() => {
      performanceTableData = getListPerformanceTableRowMock(3);
      performanceTableData[0].checked = true;
      componentInstance.performanceTableData = performanceTableData;
      fixture.detectChanges();
      const selectorFunction = storeMock.select.calls.argsFor(0)[0];
      expect(selectorFunction(stateMock)).toBe(stateMock.listsDetails);
    });
    it('Should filter out all selected Stores and call the removal action', () => {
      storeMock.dispatch.calls.reset();
      componentInstance.removeSelectedStores();
      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new ListsActions.RemoveStoreFromList({listId: stateMock.listsDetails.listSummary.summaryData.id,
          storeSourceCode: performanceTableData[0].unversionedStoreId }));
    });
  });

  describe('[Method] fireTabSelectedGAEvent', () => {
    it('Should call track event with opportunity tab title and list id', () => {
      componentInstance.fireTabSelectedGAEvent(componentInstance.opportunitiesTabTitle);
      expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
        'Lists - Shared With Me', 'View Opportunities', componentInstance.listSummary.id);
    });
    it('Should call track event with performance tab title and list id', () => {
      componentInstance.fireTabSelectedGAEvent(componentInstance.performanceTabTitle);
      expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
        'Lists - Shared With Me', 'View Performance', componentInstance.listSummary.id);
    });
  });

  describe('[Method] fireOpportunityStatusGAEvent', () => {
    const oppStats = chance.string();
    it('Should call track event with opportunity filtered', () => {
      componentInstance.fireOpportunityStatusGAEvent(oppStats);
      expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
        'Lists - Shared With Me', 'Filter Opportunities', oppStats);
    });
  });
  describe('[Method] fireDownloadCSVGAEvent', () => {
    it('Should call track event with download stores', () => {
      componentInstance.fireDownloadCSVGAEvent(ListSelectionType.Stores);
      expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
        'Lists - Shared With Me', 'Download Stores', 'Opportunities Result Set');
    });
    it('Should call track event with download stores and opps', () => {
      componentInstance.fireDownloadCSVGAEvent(ListSelectionType.Opportunities);
      expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
        'Lists - Shared With Me', 'Download Stores and Opportunities', 'Opportunities Result Set');
    });
  });
});
