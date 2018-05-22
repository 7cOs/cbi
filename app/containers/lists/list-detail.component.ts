import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';

import { ActionButtonType } from '../../enums/action-button-type.enum';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { CompassAlertModalEvent } from '../../enums/compass-alert-modal-strings.enum';
import { CompassAlertModalInputs } from '../../models/compass-alert-modal-inputs.model';
import { CompassManageListModalEvent } from '../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalOutput } from '../../models/compass-manage-list-modal-output.model';
import { CompassManageListModalOverlayRef } from '../../shared/components/compass-manage-list-modal/compass-manage-list-modal.overlayref';
import { CompassModalService } from '../../services/compass-modal.service';
import { CompassSelectOption } from '../../models/compass-select-component.model';
import { CompassActionModalEvent } from '../../enums/compass-action-modal-event.enum';
import { CompassActionModalInputs } from '../../models/compass-action-modal-inputs.model';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
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
import { LoadingState } from '../../enums/loading-state.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { User } from '../../models/lists/user.model';

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
  public compassModalOverlayRef: CompassManageListModalOverlayRef;
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
  public isSelectAllPerformanceChecked: boolean = false;
  public isSelectAllOpportunitiesChecked: boolean = false;
  public removeStoresModalInputs: CompassAlertModalInputs = {
    'title': 'Are you sure?',
    'body': 'Removing the stores from a list will remove all store performance and opportunities associated with the stores.',
    'rejectLabel': 'Cancel',
    'acceptLabel': 'Remove'};
  public removeOppsModalInputs: CompassAlertModalInputs = {
    'title': 'Are you sure?',
    'body': 'Removing the opportunities from a list cannont be undone. Store performance will still be available.',
    'rejectLabel': 'Cancel',
    'acceptLabel': 'Remove'};
  public loadingStateEnum = LoadingState;
  public showManageListLoader: boolean = false;
  public downloadAllModalStringInputs: CompassActionModalInputs;
  public compassAlertModalAccept = CompassActionModalEvent.Accept;
  public radioInputModel: RadioInputModel = {
    selected: ListsDownloadType.Stores,
    radioOptions: downloadRadioOptions,
    title: 'OPTIONS',
    stacked: false
  };
  public downloadBodyHTML: string;

  private listDetailSubscription: Subscription;
  private loadingState: LoadingState = LoadingState.Loaded;

  constructor(
    private compassModalService: CompassModalService,
    private listsTableTransformerService: ListsTableTransformerService,
    @Inject('$state') private $state: any,
    private store: Store<AppState>,
    private titleService: Title,
    @Inject('userService') private userService: any,
    @Inject('toastService') private toastService: any
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

    this.listDetailSubscription = this.store
      .select(state => state.listsDetails)
      .subscribe((listDetail: ListsState)  => {
        this.listSummary = listDetail.listSummary.summaryData;

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
        if (listDetail.manageListStatus !== ActionStatus.NotFetched) {
          this.handleManageListStatus(listDetail.manageListStatus);
        }
        if (listDetail.listStores.storeStatus === ActionStatus.DeleteSuccess
          && listDetail.listSummary.summaryStatus === ActionStatus.DeleteSuccess) {
          this.handlePaginationReset();
          this.isPerformanceRowSelect = false;
          this.toastService.showToast('storeRemoved');
          this.showManageListLoader = false;
        } else if (listDetail.listStores.storeStatus === ActionStatus.DeleteFailure
          && listDetail.listSummary.summaryStatus === ActionStatus.DeleteFailure) {
          this.toastService.showToast('storeRemovedFailure');
          this.showManageListLoader = false;
        }

        if (listDetail.listOpportunities.opportunitiesStatus === ActionStatus.DeleteSuccess) {
          this.handlePaginationReset();
          this.isOpportunityRowSelect = false;
          this.toastService.showToast('oppRemoved');
          this.showManageListLoader = false;
        } else if (listDetail.listOpportunities.opportunitiesStatus === ActionStatus.DeleteFailure) {
          this.toastService.showToast('oppRemovedFailure');
          this.showManageListLoader = false;
        }
      });
  }

  captureRemoveButtonClicked() {
    if (this.selectedTab === this.performanceTabTitle) {
      this.launchRemoveStoresConfirmation();
    }
    if (this.selectedTab === this.opportunitiesTabTitle) {
      this.launchRemoveOppsConfirmation();
    }
  }

  launchRemoveStoresConfirmation(): void {
    let compassModalOverlayRef = this.compassModalService.showAlertModalDialog(this.removeStoresModalInputs, {});
    compassModalOverlayRef.modalInstance.buttonContainerEvent.subscribe((value: string) => {
      if (value === CompassAlertModalEvent.Accept) {
        this.removeSelectedStores();
      }
    });
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

  launchRemoveOppsConfirmation(): void {
    let compassModalOverlayRef = this.compassModalService.showAlertModalDialog(this.removeOppsModalInputs, {});
    compassModalOverlayRef.modalInstance.buttonContainerEvent.subscribe((value: string) => {
      if (value === CompassAlertModalEvent.Accept) {
        this.removeSelectedOpportunities();
      }
    });
  }

  removeSelectedOpportunities(): void {
    const checkedOpps = this.opportunitiesTableData.reduce((totalOpps, store) => {
      store.opportunities.forEach((opp) => {
      if (opp.checked === true) totalOpps.push(opp);
      });
      return totalOpps;
    }, []);
    checkedOpps.forEach((opp) => {
      this.store.dispatch(new ListsActions.RemoveOppFromList({listId: this.listSummary.id, oppId: opp.id}));
      this.showManageListLoader = true;
    });
  }

  removeSelectedStores(): void {
    const checkedStores = this.performanceTableData.filter((store) => { return store.checked === true; });
    checkedStores.forEach((store) => {
      this.store.dispatch(new ListsActions.RemoveStoreFromList({listId: this.listSummary.id, storeSourceCode: store.storeSourceCode}));
      this.showManageListLoader = true;
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
      this.sortReset.next();
      this.isPerformanceRowSelect = false;
      this.isOpportunityRowSelect = false;
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
