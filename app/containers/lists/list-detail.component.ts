import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';

import { ActionButtonType } from '../../enums/action-button-type.enum';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { CompassModalService } from '../../services/compass-modal.service';
import { CompassSelectOption } from '../../models/compass-select-component.model';
import { CompassActionModalInputs } from '../../models/compass-action-modal-inputs.model';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { RadioInputModel } from '../../models/compass-radio-input.model';
import * as ListsActions from '../../state/actions//lists.action';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListsDownloadType } from '../../enums/lists/list-download-type.enum';
import { listOpportunityStatusOptions } from '../../models/list-opportunities/list-opportunity-status-options.model';
import { ListOpportunitiesColumnType } from '../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListTableDrawerRow } from '../../models/lists/list-table-drawer-row.model';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { LIST_TABLE_SIZE } from '../../shared/components/lists-pagination/lists-pagination.component';
import { ListPerformanceColumnType } from '../../enums/list-performance-column-types.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { CompassManageListModalOverlayRef } from '../../shared/components/compass-manage-list-modal/compass-manage-list-modal.overlayref';
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
  public downloadAllModalStringInputs: CompassActionModalInputs;
  public copyToListModalStringInputs: CompassActionModalInputs;
  public radioInputModel: RadioInputModel = {
    selected: ListsDownloadType.Stores,
    radioOptions: downloadRadioOptions,
    title: 'OPTIONS',
    stacked: false
  };
  public abc =
      [{
        display: 'Choose a List',
        value: 'Choose a List'
      },
      {
        display: 'All',
        value: OpportunityStatus.all
      },
      {
        display: 'Targeted',
        value: OpportunityStatus.targeted
      },
      {
        display: 'Closed',
          value: OpportunityStatus.closed
      }];

  public dropdownInputModel = {
    selected: this.abc[0].value,
    dropdownOptions: this.abc,
    title: 'LIST'
  };

  private listDetailSubscription: Subscription;

  constructor(
    private listsTableTransformerService: ListsTableTransformerService,
    private compassModalService: CompassModalService,
    @Inject('$state') private $state: any,
    private store: Store<AppState>,
    private titleService: Title,
    @Inject('userService') private userService: any
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
    this.currentUser = this.userService.model.currentUser;
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
      });
  }

  captureActionButtonClicked(actionButtonProperties: {actionType: string}): void {
    console.log([actionButtonProperties.actionType,  '- Action Button is clicked'].join(' '));
  }

  public copyToListClick(): void {
    if (this.selectedTab === this.opportunitiesTabTitle) {
      const checkedOpps = this.opportunitiesTableData.reduce((totalOpps, store) => {
        store.opportunities.forEach((opp) => {
          if (opp.checked === true) totalOpps.push({'opportunityId': opp.id});
        });
        return totalOpps;
      }, []);
      console.log(checkedOpps, 'Opps');
      this.copyToListModal(checkedOpps, this.selectedTab);
    } else {
      const checkedStores = this.performanceTableData.reduce((totalStores, store) => {
        if (store.checked === true) totalStores.push({'storeSourceCode': store.unversionedStoreId});
        return totalStores;
      }, []);
      console.log(checkedStores, 'perf');
      this.copyToListModal(checkedStores, this.selectedTab);
    }
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
    this.compassModalOverlayRef = this.compassModalService.showManageListModalDialog(
      { title: 'Manage List',
        acceptLabel: 'Save',
        rejectLabel: 'close',
        currentUser: this.currentUser,
        listObject: this.listSummary
      }, {});
    this.compassModalOverlayRef.modalInstance.buttonContainerEvent.subscribe((payload: ListsSummary) => {
      this.store.dispatch(new ListsActions.PatchList(payload));
    });
  }

  public handleListsLinkClick() {
    this.$state.go('lists');
  }

  public onTabClicked(tabName: string): void {
    this.selectedTab = tabName;
    if (tabName !== this.activeTab) {
      this.activeTab = tabName;
      this.paginationReset.next();
      this.sortReset.next();
    }
    if (tabName === this.performanceTabTitle) {
      this.opportunitiesTableData = this.getDeselectedOpportunitiesTableData(this.opportunitiesTableData);
      this.oppStatusSelected = listOpportunityStatusOptions.find(status => status.value === OpportunityStatus.all).value;
      this.filteredOpportunitiesTableData = this.opportunitiesTableData;
      this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
    }
  }

  public handlePaginationReset() {
    this.paginationReset.next();
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

  private copyToListModal(checkedEntities: any, tabName: string) {
      this.copyToListModalStringInputs = {
        'title': 'Copy to List',
        'dropdownInputModel': this.dropdownInputModel,
        'acceptLabel': 'COPY',
        'rejectLabel': 'CANCEL'
      };
      let compassModalOverlayRef = this.compassModalService.showActionModalDialog(this.copyToListModalStringInputs, null);
      this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value: any) => {
        console.log('dropdown option selected: ', value.dropdownOptionSelected);
        console.log('accept clicked');
        if (tabName === this.performanceTabTitle) {
          // API call to Copy to list (Stores)
        } else {
          // API call to Copy to list (Opps)
        }
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
