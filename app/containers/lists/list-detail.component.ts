import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { ActionButtonType } from '../../enums/action-button-type.enum';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { CompassActionModalOutputs } from '../../models/compass-action-modal-outputs.model';
import { CompassManageListModalEvent } from '../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalOutput } from '../../models/compass-manage-list-modal-output.model';
import { CompassManageListModalOverlayRef } from '../../shared/components/compass-manage-list-modal/compass-manage-list-modal.overlayref';
import { CompassModalService } from '../../services/compass-modal.service';
import { CompassSelectOption } from '../../models/compass-select-component.model';
import { CompassActionModalInputs } from '../../models/compass-action-modal-inputs.model';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DropdownInputModel, DropDownMenu } from '../../models/compass-dropdown-input.model';
import { RadioInputModel } from '../../models/compass-radio-input.model';
import * as ListsActions from '../../state/actions//lists.action';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListsDownloadType } from '../../enums/lists/list-download-type.enum';
import { ListOpportunitiesColumnType } from '../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { listOpportunityStatusOptions } from '../../models/list-opportunities/list-opportunity-status-options.model';
import { ListPerformanceColumnType } from '../../enums/list-performance-column-types.enum';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { ListTableDrawerRow } from '../../models/lists/list-table-drawer-row.model';
import { LIST_TABLE_SIZE } from '../../shared/components/lists-pagination/lists-pagination.component';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { User } from '../../models/lists/user.model';
import { GroupedLists } from '../../models/lists/grouped-lists.model';
import { V3List } from '../../models/lists/v3-list.model';

interface ListPageClick {
  pageNumber: number;
}

export interface PageChangeData {
  pageStart: number;
  pageEnd: number;
}

export const downloadRadioOptions: Array<CompassSelectOption> = [{
  display: 'Stores',
  value: ListsDownloadType.Stores
}, {
  display: 'Stores and Opportunities',
  value: ListsDownloadType.Opportunities
}];

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {
  paginationReset: Subject<Event> = new Subject();
  sortReset: Subject<Event> = new Subject();

  public allLists: GroupedLists;
  public listSummary: ListsSummary;
  public performanceTabTitle: string = 'Performance';
  public opportunitiesTabTitle: string = 'Opportunities';
  public actionButtonType: any = ActionButtonType;
  public filteredOpportunitiesTableData: ListOpportunitiesTableRow[];
  public opportunityStatusOptions: Array<CompassSelectOption> = [];
  public oppStatusSelected: OpportunityStatus;
  public performanceTableHeader: string[] = ['Store', 'Distributor', 'Segment', 'Depletions', ' Effective POD', 'Last Depletion'];
  public performanceTableTotal: ListPerformanceTableRow;
  public performanceTableData: ListPerformanceTableRow[];
  public opportunitiesTableDataSize: number;
  public opportunitiesTableHeader: string[] = ['Store', 'Distributor', 'Segment', 'Depletions', ' Opportunities', 'Last Depletion'];
  public currentUser: User;
  public opportunitiesTableData: ListOpportunitiesTableRow[];
  public performanceTableDataSize: number;
  public listTableSize: number = LIST_TABLE_SIZE;
  public pageChangeData: PageChangeData;
  public performanceSortingCriteria: Array<SortingCriteria> = [{
    columnType: ListPerformanceColumnType.cytdColumn,
    ascending: false
  }];
  public opportunitiesSortingCriteria: Array<SortingCriteria> = [{
    columnType: ListOpportunitiesColumnType.cytdColumn,
    ascending: false
  }];
  public selectedTab: string = this.performanceTabTitle;
  public activeTab: string = this.performanceTabTitle;
  public isPerformanceRowSelect: boolean = false;
  public isOpportunityRowSelect: boolean = false;
  public showManageListLoader: boolean = false;
  public downloadAllModalStringInputs: CompassActionModalInputs;
  public copyToListModalStringInputs: CompassActionModalInputs;
  public copyToListLoader: boolean;
  public radioInputModel: RadioInputModel = {
    selected: ListsDownloadType.Stores,
    radioOptions: downloadRadioOptions,
    title: 'OPTIONS',
    stacked: false
  };

  public dropdownInputModel: DropdownInputModel;
  public downloadBodyHTML: string;

  private listDetailSubscription: Subscription;

  constructor(
    private compassModalService: CompassModalService,
    private listsTableTransformerService: ListsTableTransformerService,
    @Inject('$state') private $state: any,
    private store: Store<AppState>,
    private titleService: Title,
    @Inject('userService') private userService: any
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
    this.currentUser = {
      employeeId: this.userService.model.currentUser.employeeID,
      firstName: this.userService.model.currentUser.firstName,
      lastName: this.userService.model.currentUser.lastName
    };
    this.opportunityStatusOptions = listOpportunityStatusOptions;
    this.oppStatusSelected = OpportunityStatus.all;

    this.store.dispatch(new ListsActions.FetchStoreDetails({listId: this.$state.params.id}));
    this.store.dispatch(new ListsActions.FetchHeaderDetails({listId: this.$state.params.id}));
    this.store.dispatch(new ListsActions.FetchOppsForList({listId: this.$state.params.id}));
    this.store.dispatch(new ListsActions.FetchListPerformanceVolume({
      listId: this.$state.params.id,
      performanceType: ListPerformanceType.Volume,
      beverageType: ListBeverageType.Beer,
      dateRangeCode: DateRangeTimePeriodValue.CYTDBDL
    }));
    this.store.dispatch(new ListsActions.FetchListPerformancePOD({
      listId: this.$state.params.id,
      performanceType: ListPerformanceType.POD,
      beverageType: ListBeverageType.Beer,
      dateRangeCode: DateRangeTimePeriodValue.L90BDL
    }));
    this.store.dispatch(new ListsActions.FetchLists({currentUserEmployeeID: this.currentUser.employeeId}));

    this.listDetailSubscription = this.store
      .select(state => state.listsDetails)
      .subscribe((listDetail: ListsState)  => {
        this.listSummary = listDetail.listSummary.summaryData;
        this.allLists = listDetail.allLists;

        if (this.isListPerformanceFetched(
          listDetail.listStores.storeStatus,
          listDetail.performance.volumeStatus,
          listDetail.performance.podStatus
        )) {
          this.performanceTableTotal = this.listsTableTransformerService.transformPerformanceTotal(
            listDetail.performance.volume,
            listDetail.performance.pod
          );
          this.performanceTableData = this.listsTableTransformerService.transformPerformanceCollection(
            listDetail.listStores.stores,
            listDetail.performance.volume.storePerformance,
            listDetail.performance.pod.storePerformance
          );

          this.performanceTableDataSize = this.performanceTableData.length;
        }

        if (this.isListOpportunitiesFetched(
          listDetail.listStores.storeStatus,
          listDetail.performance.volumeStatus,
          listDetail.listOpportunities.opportunitiesStatus
        )) {
          this.opportunitiesTableData = this.listsTableTransformerService.transformOpportunitiesCollection(
            listDetail.listStores.stores,
            listDetail.performance.volume.storePerformance,
            listDetail.listOpportunities.opportunities
          );
          this.filteredOpportunitiesTableData = this.oppStatusSelected === OpportunityStatus.all ?
            this.opportunitiesTableData : this.filterOpportunitiesByStatus(
              this.oppStatusSelected,
              this.opportunitiesTableData
            );
          this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
        }

        if (listDetail.copyStatus !== ActionStatus.NotFetched) {
          this.copyToListLoader = listDetail.copyStatus === ActionStatus.Fetching;
        }

        if (listDetail.copyStatus === ActionStatus.Fetched || listDetail.copyStatus === ActionStatus.Error) {
          this.handlePaginationReset();
          this.isPerformanceRowSelect = false;
          this.isOpportunityRowSelect = false;
        }

        if (listDetail.manageListStatus !== ActionStatus.NotFetched) {
          this.handleManageListStatus(listDetail.manageListStatus);
        }

      });
  }

  captureActionButtonClicked(actionButtonProperties: {actionType: string}): void {
    console.log([actionButtonProperties.actionType,  '- Action Button is clicked'].join(' '));
  }

  public copyToListClick(): void {
    const ownedAndSharedList = this.allLists.owned.concat(this.allLists.sharedWithMe);
    const listDropDownMenu: DropDownMenu[] = ownedAndSharedList.map((list: V3List) => {
      return {
        display: list.name,
        value: list.id
      };
    });

    listDropDownMenu.unshift({display: 'Choose a List', value: 'Choose a List'});

    this.dropdownInputModel = {
      selected: listDropDownMenu[0].value,
      dropdownOptions: listDropDownMenu,
      title: 'LIST'
    };

    if (this.selectedTab === this.opportunitiesTabTitle) {
      const checkedOpps: {opportunityId: string}[] = this.opportunitiesTableData.reduce((totalOpps, store) => {
        store.opportunities.forEach((opp) => {
          if (opp.checked === true) totalOpps.push({opportunityId: opp.id});
        });
        return totalOpps;
      }, []);
      this.copyToListModal(checkedOpps);
    } else {
      const checkedStores: string[] = this.performanceTableData.reduce((totalStores, store) => {
        if (store.checked === true) totalStores.push(store.unversionedStoreId);
        return totalStores;
      }, []);
      this.copyToListModal(checkedStores);

    }
  }

  downloadActionButtonClicked() {
    if (this.selectedTab === this.performanceTabTitle) {
      console.log('Download All - performance tab seclected');
    } else {
      console.log('Download All - opps tab seclected');
    }

    this.downloadBodyHTML = 'Body text goes here!';
    this.downloadAllModalStringInputs = {
      'title': 'Download',
      'bodyText': this.downloadBodyHTML,
      'radioInputModel': this.radioInputModel,
      'acceptLabel': 'Download',
      'rejectLabel': 'Cancel'
    };
    let compassModalOverlayRef = this.compassModalService.showActionModalDialog(this.downloadAllModalStringInputs, null);
    this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value: any) => {
        console.log('radio option selected: ', value.radioOptionSelected);
        console.log('dropdown option selected: ', value.dropdownOptionSelected);
    });
  }

  opportunityStatusSelected(statusValue: OpportunityStatus) {
    this.oppStatusSelected = statusValue;
    this.filteredOpportunitiesTableData = this.oppStatusSelected === OpportunityStatus.all ?
      this.opportunitiesTableData : this.filterOpportunitiesByStatus(
        this.oppStatusSelected,
        this.opportunitiesTableData
      );
    this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
    this.paginationReset.next();
  }

  filterOpportunitiesByStatus(status: OpportunityStatus, oppsTableData: ListOpportunitiesTableRow[]): ListOpportunitiesTableRow[] {
    const filterOpportunities = (opportunityRows: ListTableDrawerRow[]) => {
      return opportunityRows.filter((opp: ListTableDrawerRow) => {
        return status === OpportunityStatus.targeted ?
          opp.status === OpportunityStatus.targeted
          || opp.status === OpportunityStatus.inactive : opp.status === OpportunityStatus.closed;
      });
    };

    return oppsTableData.reduce((accumulatedStoreRows: ListOpportunitiesTableRow[], storeRow: ListOpportunitiesTableRow) => {
      const storeRowFiltered = Object.assign({}, storeRow, {
        opportunities: filterOpportunities(storeRow.opportunities)
      });
      if (storeRowFiltered.opportunities.length) {
        storeRowFiltered.opportunitiesColumn = storeRowFiltered.opportunities.length;
        accumulatedStoreRows.push(storeRowFiltered);
      }
      return accumulatedStoreRows;
    }, []);
  }

  ngOnDestroy() {
    this.listDetailSubscription.unsubscribe();
  }

  public handlePageClick(event: ListPageClick) {
    const pageNumber = event.pageNumber;
    let pageStart = ((pageNumber - 1 ) * LIST_TABLE_SIZE);
    let pageEnd = (pageNumber * LIST_TABLE_SIZE) ;
    this.pageChangeData = {pageStart: pageStart, pageEnd: pageEnd};
  }

  public handleManageButtonClick() {
    const manageModalRef: CompassManageListModalOverlayRef = this.compassModalService.showManageListModalDialog({
      title: 'Manage List',
      acceptLabel: 'Save',
      rejectLabel: 'CANCEL',
      currentUser: this.currentUser,
      listObject: this.listSummary
    }, {});

    manageModalRef.modalInstance.buttonContainerEvent.subscribe((manageModalData: CompassManageListModalOutput) => {
      this.handleManageModalEvent(manageModalData);
    });
  }

  public handleListsLinkClick() {
    this.$state.go('lists');
  }

  public setPerformanceRowSelected(performanceRowTrueCount: number) {
    performanceRowTrueCount !== 0 ? this.isPerformanceRowSelect = true : this.isPerformanceRowSelect = false;
  }

  public setSelectAllPerformance(selectAllChecked: boolean) {
    this.isPerformanceRowSelect = selectAllChecked;
  }

  public setSelectAllOpportunity(selectAllChecked: boolean) {
    this.isOpportunityRowSelect = selectAllChecked;
  }

  public setOpportunityRowSelected(opportunityRowTrueCount: number) {
    opportunityRowTrueCount !== 0 ? this.isOpportunityRowSelect = true : this.isOpportunityRowSelect = false;
  }

  public onTabClicked(tabName: string): void {
    this.selectedTab = tabName;
    if (tabName !== this.activeTab) {
      this.activeTab = tabName;
      this.paginationReset.next();
      this.isPerformanceRowSelect = false;
      this.isOpportunityRowSelect = false;
      this.sortReset.next();
    }
    if (tabName === this.performanceTabTitle) {
      this.opportunitiesTableData = this.getDeselectedOpportunitiesTableData(this.opportunitiesTableData);
      this.oppStatusSelected = listOpportunityStatusOptions.find(status => status.value === OpportunityStatus.all).value;
      this.filteredOpportunitiesTableData = this.opportunitiesTableData;
      this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
    }
    if (tabName === this.opportunitiesTabTitle) {
      this.performanceTableData = this.getDeselectedPerformanceTableData(this.performanceTableData);
    }
  }

  public handlePaginationReset() {
    this.paginationReset.next();
  }

  public handleManageModalEvent(manageModalData: CompassManageListModalOutput): void {
    switch (manageModalData.type) {
      case CompassManageListModalEvent.Save:
        this.store.dispatch(new ListsActions.PatchList(manageModalData.listSummary));
        break;
      case CompassManageListModalEvent.Delete:
        this.store.dispatch(new ListsActions.DeleteList(manageModalData.listSummary.id));
        break;
      case CompassManageListModalEvent.Archive:
        this.store.dispatch(new ListsActions.ArchiveList(manageModalData.listSummary));
        break;
      case CompassManageListModalEvent.Leave:
        this.store.dispatch(new ListsActions.LeaveList({
          currentUserEmployeeId: this.currentUser.employeeId,
          listSummary: manageModalData.listSummary
        }));
        break;
      default:
        throw new Error(`[handleManageModalEvent]: CompassManageListModalEvent of ${ manageModalData.type } is not supported`);
    }
  }

  public handleManageListStatus(manageListStatus: ActionStatus): void {
    this.showManageListLoader = manageListStatus === ActionStatus.Fetching;

    if (manageListStatus === ActionStatus.Fetched) this.$state.go('lists');
  }

  public handleCopyModalEvent (value: CompassActionModalOutputs, checkedEntities: (string | {opportunityId: string})[]) {
    const listId: string = value.dropdownOptionSelected;
    if (this.selectedTab === this.performanceTabTitle) {
      checkedEntities.forEach((storeCode: string) => {
        this.store.dispatch(new ListsActions.CopyStoresToList({listId: listId, id: storeCode}));
      });
    } else {
      const opportunityIds = <{opportunityId: string}[]>checkedEntities;
      this.store.dispatch(new ListsActions.CopyOppsToList({listId: listId, ids: opportunityIds}));
    }
  }

  private isListPerformanceFetched(
    storeStatus: ActionStatus,
    volumePerformanceStatus: ActionStatus,
    podPerformanceStatus: ActionStatus
  ): boolean {
    return storeStatus === ActionStatus.Fetched
      && volumePerformanceStatus === ActionStatus.Fetched
      && podPerformanceStatus === ActionStatus.Fetched;
  }

  private isListOpportunitiesFetched(
    storeStatus: ActionStatus,
    volumePerformanceStatus: ActionStatus,
    opportunitiesStatus: ActionStatus
  ): boolean {
    return storeStatus === ActionStatus.Fetched
      && volumePerformanceStatus === ActionStatus.Fetched
      && opportunitiesStatus === ActionStatus.Fetched;
  }

  private copyToListModal(checkedEntities: (string | {opportunityId: string})[]): void {
    this.copyToListModalStringInputs = {
      'title': 'Copy to List',
      'dropdownInputModel': this.dropdownInputModel,
      'acceptLabel': 'COPY',
      'rejectLabel': 'CANCEL'
    };
    let compassModalOverlayRef = this.compassModalService.showActionModalDialog(this.copyToListModalStringInputs, null);
    const subscription = Observable.fromPromise(
      this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance)
    );
    subscription.subscribe((value: any) => {
      this.handleCopyModalEvent(value, checkedEntities);
    });
  }

  private getDeselectedPerformanceTableData(performanceTableData: ListPerformanceTableRow[]): ListPerformanceTableRow[] {
    return performanceTableData.map((tableRow: ListPerformanceTableRow) => {
      return Object.assign({}, tableRow, {
        checked: false
      });
    });
  }

  private getDeselectedOpportunitiesTableData(opportunitiesTableData: ListOpportunitiesTableRow[]): ListOpportunitiesTableRow[] {
    const clearTableDrawerSelections = (opportunityRows: ListTableDrawerRow[]): ListTableDrawerRow[] => {
      return opportunityRows.map((opportunityRow: ListTableDrawerRow) => {
        return Object.assign({}, opportunityRow, {
          checked: false
        });
      });
    };

    return opportunitiesTableData.map((tableRow: ListOpportunitiesTableRow) => {
      return Object.assign({}, tableRow, {
        opportunities: clearTableDrawerSelections(tableRow.opportunities),
        checked: false,
        expanded: false
      });
    });
  }
}
