import * as moment from 'moment';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { ActionButtonType } from '../../enums/action-button-type.enum';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { CompassActionModalOutputs } from '../../models/compass-action-modal-outputs.model';
import { CompassActionModalEvent } from '../../enums/compass-action-modal-event.enum';
import { CompassAlertModalEvent } from '../../enums/compass-alert-modal-strings.enum';
import { CompassManageListModalEvent } from '../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalOutput } from '../../models/compass-manage-list-modal-output.model';
import { CompassManageListModalOverlayRef } from '../../shared/components/compass-manage-list-modal/compass-manage-list-modal.overlayref';
import { CompassModalService } from '../../services/compass-modal.service';
import { CompassSelectOption } from '../../models/compass-select-component.model';
import { CompassActionModalInputs } from '../../models/compass-action-modal-inputs.model';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DropdownInputModel, DropDownMenu } from '../../models/compass-dropdown-input.model';
import { GroupedLists } from '../../models/lists/grouped-lists.model';
import * as ListsActions from '../../state/actions//lists.action';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import * as ListDetailModalStrings from '../lists/list-detail-modal-strings.const';
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
import { ListStoresDownloadCSV } from '../../models/lists/list-stores-download-csv.model';
import { ListOpportunitiesDownloadCSV } from '../../models/lists/list-opportunities-download-csv.model';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { ListTableDrawerRow } from '../../models/lists/list-table-drawer-row.model';
import { LIST_TABLE_SIZE } from '../../shared/components/lists-pagination/lists-pagination.component';
import { LoadingState } from '../../enums/loading-state.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunitiesByStore } from '../../models/lists/opportunities-by-store.model';
import { OpportunityTypeLabel } from '../../enums/list-opportunities/list-opportunity-type-label.enum';
import { RadioInputModel } from '../../models/compass-radio-input.model';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { User } from '../../models/lists/user.model';
import { V3List } from '../../models/lists/v3-list.model';

interface ListPageClick {
  pageNumber: number;
}

export interface PageChangeData {
  pageStart: number;
  pageEnd: number;
}

export const downloadRadioOptions: Array<CompassSelectOption> = [{
  display: 'Stores Only',
  value: ListsDownloadType.Stores
}, {
  display: 'Stores and Opportunities',
  value: ListsDownloadType.Opportunities
}];

export const SIMPLE_OPPORTUNITY_SKU_PACKAGE_LABEL: string = 'ANY';

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
  public isSelectAllPerformanceChecked: boolean = false;
  public isSelectAllOpportunitiesChecked: boolean = false;
  public removeStoresModalInputs = ListDetailModalStrings.REMOVE_STORE_MODAL_CONFIG;
  public removeOppsModalInputs = ListDetailModalStrings.REMOVE_OPPS_MODAL_CONFIG;
  public loadingStateEnum = LoadingState;
  public showManageListLoader: boolean = false;
  public downloadAllModalStringInputs: CompassActionModalInputs;
  public copyToListLoader: boolean;
  public radioInputModel: RadioInputModel = {
    selected: ListsDownloadType.Stores,
    radioOptions: downloadRadioOptions,
    title: 'OPTIONS',
    stacked: false
  };

  public copyDropdownInputModel: DropdownInputModel;
  public totalOppsForList: number;
  public isOppsTabDataFetched: boolean = false;
  public isPerformanceTabDataFetched: boolean = false;
  public downloadBodyHTML: string;
  public groupedOppsByStore: OpportunitiesByStore;

  private listDetailSubscription: Subscription;

  constructor(
    private compassModalService: CompassModalService,
    private listsTableTransformerService: ListsTableTransformerService,
    @Inject('$state') private $state: any,
    private store: Store<AppState>,
    private titleService: Title,
    private numberPipe: DecimalPipe,
    private upperCasePipe: UpperCasePipe,
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
          this.isPerformanceTabDataFetched = !!this.performanceTableDataSize;
        }

        if (this.isListOpportunitiesFetched(
          listDetail.listStores.storeStatus,
          listDetail.performance.volumeStatus,
          listDetail.listOpportunities.opportunitiesStatus
        )) {
          this.groupedOppsByStore = listDetail.listOpportunities.opportunities;
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
          this.totalOppsForList = this.getCumulativeOppsForList(this.filteredOpportunitiesTableData);
          this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
          this.isOppsTabDataFetched = !!this.opportunitiesTableDataSize;
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
        if (listDetail.listStores.storeStatus === ActionStatus.DeleteSuccess
          && listDetail.listSummary.summaryStatus === ActionStatus.DeleteSuccess) {
          this.resetOnOpportunityOrStoreRemoval();
        } else if (listDetail.listStores.storeStatus === ActionStatus.DeleteFailure
          && listDetail.listSummary.summaryStatus === ActionStatus.DeleteFailure) {
          this.showManageListLoader = false;
        }

        if (listDetail.listOpportunities.opportunitiesStatus === ActionStatus.DeleteSuccess) {
          this.resetOnOpportunityOrStoreRemoval();
        } else if (listDetail.listOpportunities.opportunitiesStatus === ActionStatus.DeleteFailure) {
          this.showManageListLoader = false;
        }

      });
  }

  public copyToListClick(): void {
    const ownedAndSharedList: V3List[] = this.allLists.owned.concat(this.allLists.sharedWithMe);
    const listDropDownMenu: DropDownMenu[] = ownedAndSharedList.map((list: V3List) => {
      return {
        display: list.name,
        value: list.id
      };
    });
    listDropDownMenu.unshift({display: 'Choose a List', value: 'Choose a List'});

    this.copyDropdownInputModel = {
      selected: listDropDownMenu[0].value,
      dropdownOptions: listDropDownMenu,
      title: 'LIST'
    };

    if (this.selectedTab === this.opportunitiesTabTitle) {
      const checkedOpps: {opportunityId: string}[] = this.opportunitiesTableData.reduce(
        (totalOpps: {opportunityId: string}[], store: ListOpportunitiesTableRow) => {
        store.opportunities.forEach((opp) => {
          if (opp.checked === true) totalOpps.push({opportunityId: opp.id});
        });
        return totalOpps;
      }, []);
      this.copyToListModal(checkedOpps);
    } else {
      const checkedStores: string[] = this.performanceTableData.reduce(
        (totalStores: string[], store: ListPerformanceTableRow) => {
        if (store.checked === true) totalStores.push(store.unversionedStoreId);
        return totalStores;
      }, []);
      this.copyToListModal(checkedStores);
    }
  }

  resetOnOpportunityOrStoreRemoval(): void {
    this.handlePaginationReset();
    this.isOpportunityRowSelect = false;
    this.isPerformanceRowSelect = false;
    this.showManageListLoader = false;
  }

  captureRemoveButtonClicked(): void {
    if (this.selectedTab === this.performanceTabTitle) {
      this.launchRemoveStoresConfirmation();
    }
    if (this.selectedTab === this.opportunitiesTabTitle) {
      this.launchRemoveOppsConfirmation();
    }
  }

  launchRemoveStoresConfirmation(): void {
    const compassModalOverlayRef = this.compassModalService.showAlertModalDialog(this.removeStoresModalInputs, {});
    compassModalOverlayRef.modalInstance.buttonContainerEvent.subscribe((value: string) => {
      if (value === CompassAlertModalEvent.Accept) {
        this.removeSelectedStores();
      }
    });
  }
   downloadActionButtonClicked(): void {
    let numStores = 0;
    if (this.selectedTab === this.performanceTabTitle) {
      numStores = this.performanceTableDataSize;
    } else {
      numStores = this.opportunitiesTableDataSize;
    }

    this.downloadBodyHTML = '<b> CURRENT DOWNLOAD CONTAINS </b> <br/> <br/> <b>' +
      this.totalOppsForList + ' opportunities </b> across ' + numStores + ' stores </div>';
    this.downloadAllModalStringInputs = {
      'title': 'Download',
      'bodyText': this.downloadBodyHTML,
      'radioInputModel': this.radioInputModel,
      'acceptLabel': 'Download',
      'rejectLabel': 'Cancel'
    };
    let compassModalOverlayRef = this.compassModalService.showActionModalDialog(this.downloadAllModalStringInputs, null);
    this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value: any) => {
        const csvDownloadData = this.modalDownloadClicked(value);
        this.generateCSVForDownload(value, csvDownloadData);
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
    const checkedOpps = this.opportunitiesTableData.reduce((totalOpps: ListTableDrawerRow[], store: ListOpportunitiesTableRow) => {
      store.opportunities.forEach((opp) => {
      if (opp.checked === true) totalOpps.push(opp);
      });
      return totalOpps;
    }, []);
    checkedOpps.forEach((opp: ListTableDrawerRow) => {
      this.store.dispatch(new ListsActions.RemoveOppFromList({listId: this.listSummary.id, oppId: opp.id}));
      this.showManageListLoader = true;
    });
  }

  removeSelectedStores(): void {
    const checkedStores = this.performanceTableData.filter((store) => { return store.checked === true; });
    checkedStores.forEach((store) => {
      this.store.dispatch(new ListsActions.RemoveStoreFromList({listId: this.listSummary.id, storeSourceCode: store.unversionedStoreId}));
      this.showManageListLoader = true;
    });
  }

  opportunityStatusSelected(statusValue: OpportunityStatus): void {
    this.oppStatusSelected = statusValue;
    this.filteredOpportunitiesTableData = this.oppStatusSelected === OpportunityStatus.all ?
      this.opportunitiesTableData : this.filterOpportunitiesByStatus(
        this.oppStatusSelected,
        this.opportunitiesTableData
      );
    this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
    this.isOppsTabDataFetched = !!this.opportunitiesTableDataSize;
    this.totalOppsForList = this.getCumulativeOppsForList(this.filteredOpportunitiesTableData);
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

  public handlePageClick(event: ListPageClick): void {
    const pageNumber = event.pageNumber;
    let pageStart = ((pageNumber - 1 ) * LIST_TABLE_SIZE);
    let pageEnd = (pageNumber * LIST_TABLE_SIZE) ;
    this.pageChangeData = {pageStart: pageStart, pageEnd: pageEnd};
  }

  public handleManageButtonClick(): void {
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

  public handleListsLinkClick(): void {
    this.$state.go('lists');
  }

  public setPerformanceRowSelected(performanceRowTrueCount: number): void {
    this.isPerformanceRowSelect = performanceRowTrueCount !== 0;
  }

  public setSelectAllPerformance(selectAllChecked: boolean): void {
    this.isPerformanceRowSelect = selectAllChecked;
  }

  public setSelectAllOpportunity(selectAllChecked: boolean): void {
    this.isOpportunityRowSelect = selectAllChecked;
  }

  public setOpportunityRowSelected(opportunityRowTrueCount: number): void {
    this.isOpportunityRowSelect = opportunityRowTrueCount !== 0;
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
      this.totalOppsForList = this.getCumulativeOppsForList(this.filteredOpportunitiesTableData);
    }
    if (tabName === this.opportunitiesTabTitle) {
      this.performanceTableData = this.getDeselectedPerformanceTableData(this.performanceTableData);
    }
  }

  public handlePaginationReset(): void {
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

  public modalDownloadClicked(value: CompassActionModalOutputs): Array<ListStoresDownloadCSV | ListOpportunitiesDownloadCSV> {
    let exportData: Array<ListPerformanceTableRow | ListOpportunitiesTableRow>;
    if (this.selectedTab === this.performanceTabTitle) {
      exportData = this.performanceTableData;
    } else {
      exportData = this.filteredOpportunitiesTableData;
    }

    if (value.radioOptionSelected === ListsDownloadType.Stores) {
      return exportData.reduce(
        (csvData: Array<ListStoresDownloadCSV>, store: ListPerformanceTableRow) => {
          csvData = this.pushStoresDataToCSV(store, csvData);
          return csvData;
        }, []);
    } else {
      return exportData.reduce(
        (csvData: Array<ListOpportunitiesDownloadCSV>, store: ListOpportunitiesTableRow) => {
          const oppsForStore: ListsOpportunities[] = this.groupedOppsByStore[store.unversionedStoreId];
          if (!oppsForStore) {
            csvData = this.pushOpportunitiesDataToCSV(store, csvData);
          } else {
            const filteredOpportunities = (opportunityRows: ListsOpportunities[]): ListsOpportunities[] => {
              return opportunityRows.filter((opp: ListsOpportunities) => {
                return this.oppStatusSelected === OpportunityStatus.targeted ?
                  opp.status === OpportunityStatus.targeted
                  || opp.status === OpportunityStatus.inactive : opp.status === OpportunityStatus.closed;
              });
            };
            const oppsForCSV: ListsOpportunities[] = this.oppStatusSelected === OpportunityStatus.all
              ? oppsForStore
              : filteredOpportunities(oppsForStore);
            oppsForCSV.forEach((opportunity: ListsOpportunities) => {
              csvData = this.pushOpportunitiesDataToCSV(store, csvData, opportunity);
            });
          }
          return csvData;
        }, []);
    }
  }

  private copyToListModal(checkedEntities: (string | {opportunityId: string})[]): void {
    const copyToListModalStringInputs: CompassActionModalInputs = {
      title: 'Copy to List',
      dropdownInputModel: this.copyDropdownInputModel,
      acceptLabel: CompassActionModalEvent.Copy,
      rejectLabel: CompassActionModalEvent.Cancel
    };
    let compassModalOverlayRef = this.compassModalService.showActionModalDialog(copyToListModalStringInputs, null);
    const copyModalSubscription = Observable.fromPromise(
      this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance)
    );
    copyModalSubscription.subscribe((value: CompassActionModalOutputs) => {
      this.handleCopyModalEvent(value, checkedEntities);
    });
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

  private pushOpportunitiesDataToCSV(
    store: ListOpportunitiesTableRow,
    csvData: Array<ListOpportunitiesDownloadCSV>,
    opps?: ListsOpportunities
  ) {
    csvData.push({
      distributor: store.distributorColumn,
      distributorCustomerCode: store.distributorCustomerCode,
      distributorSalesperson: store.distributorSalesperson,
      storeName: store.storeColumn,
      storeNumber: store.storeNumber === 'UNKNOWN' ? '' : store.storeNumber,
      address: store.storeAddressSubline,
      city: store.storeCity,
      state: store.storeState,
      cytdVolume: Math.round(store.cytdColumn),
      cytdVsYaPercentage: `${this.numberPipe.transform(store.cytdVersusYaPercentColumn, '1.1-1')}%`,
      segmentCode: store.segmentColumn,
      productBrand: opps ? opps.brandDescription : '',
      productSku: opps
        ? opps.isSimpleDistribution ? SIMPLE_OPPORTUNITY_SKU_PACKAGE_LABEL : opps.skuDescription
        : '',
      opportunityStatus: opps
        ? this.upperCasePipe.transform(opps.status) || ''
        : '',
      opportunityType: opps
        ? OpportunityTypeLabel[opps.type] || opps.type
        : '',
      opportunityImpact: opps
        ? this.upperCasePipe.transform(opps.impact) || ''
        : '',
    });
    return csvData;
  }

  private pushStoresDataToCSV(
    store: ListPerformanceTableRow,
    csvData: Array<ListStoresDownloadCSV>
  ) {
    csvData.push({
      distributor: store.distributorColumn,
      distributorCustomerCode: store.distributorCustomerCode,
      distributorSalesperson: store.distributorSalesperson,
      storeName: store.storeColumn,
      storeNumber: store.storeNumber === 'UNKNOWN' ? '' : store.storeNumber,
      address: store.storeAddressSubline,
      city: store.storeCity,
      state: store.storeState,
      cytdVolume: Math.round(store.cytdColumn),
      cytdVsYaPercentage: `${this.numberPipe.transform(store.cytdVersusYaPercentColumn, '1.1-1')}%`,
      segmentCode: store.segmentColumn,
    });
    return csvData;
  }

  private getCumulativeOppsForList(oppsData: ListOpportunitiesTableRow[]): number {
    let cumulativeOppsCount: number = 0;
    oppsData.map((eachStore: ListOpportunitiesTableRow) => {
      cumulativeOppsCount += eachStore.opportunities.length;
    });
    return cumulativeOppsCount;
  }

  private generateCSVForDownload(
    value: CompassActionModalOutputs,
    csvDownloadData: Array<ListStoresDownloadCSV | ListOpportunitiesDownloadCSV>): void {
      const storesHeader = [
        'Distributor',
        'Distributor Customer Code',
        'Distributor Sales Route (Primary)',
        'Store Name',
        'Store Number',
        'Address',
        'City',
        'State',
        'CYTD Volume',
        'vs YA %',
        'Segment'
      ];
      let oppsHeader = [...storesHeader];
      oppsHeader.push.apply(oppsHeader, [
        'Product Brand',
        'Product Sku',
        'Opportunity Status',
        'Opportunity Type',
        'Opportunity Predicted Impact'
      ]);
      const csvHeaders = value.radioOptionSelected === ListsDownloadType.Stores ? storesHeader : oppsHeader;
      const csvTitle = value.radioOptionSelected === ListsDownloadType.Stores
        ? `${moment().format('YYYY-MM-DD')}${ListsDownloadType.Stores}`
        : `${moment().format('YYYY-MM-DD')}${ListsDownloadType.Opportunities}`;
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: true,
        noDownload: false,
        headers: csvHeaders
      };
      const csvObj = new Angular5Csv(csvDownloadData, csvTitle, options);
      csvObj.fileName = csvTitle;
  }
}
