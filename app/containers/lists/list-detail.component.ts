import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { ActionButtonType } from '../../enums/action-button-type.enum';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { getListOpportunitiesHeaderRowMock,
         getListOpportunitiesTableRowMock
       } from '../../models/list-opportunities/list-opportunities-table-row.model.mock';
import * as ListsActions from '../../state/actions//lists.action';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { LIST_TABLE_SIZE } from '../../shared/components/lists-pagination/lists-pagination.component';
import { StoreDetails } from '../../models/lists/lists-store.model';
import { ListPerformanceColumnType } from '../../enums/list-performance-column-types.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ListOpportunitiesColumnType } from '../../enums/list-opportunities-column-types.enum';

interface ListPageClick {
  pageNumber: number;
}

interface TabSelected {
  selectedTab: string;
}

export interface PageChangeData {
  pageStart: number;
  pageEnd: number;
}

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {
  public storeList: StoreDetails[];
  public listSummary: ListsSummary;
  public oppsGroupedByStores: {};

  public firstTabTitle: string = 'Performance';
  public secondTabTitle: string = 'Opportunities';
  public selectedTab: string = 'Performance';

  // TODO: Remove this when we get real data.
  public opportunitiesTableData: Array<ListOpportunitiesTableRow> = getListOpportunitiesTableRowMock(400);
  public opportunitiesTableDataSize: number = this.opportunitiesTableData.length;
  public opportunitiesTableHeader = getListOpportunitiesHeaderRowMock();

  public actionButtonType: any = ActionButtonType;
  public performanceTableHeader: string[] = ['Store', 'Distributor', 'Segment', 'Depeletions', ' Effective POD', 'Last Depletion'];
  public performanceTableTotal: ListPerformanceTableRow;
  public performanceTableData: ListPerformanceTableRow[];
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

  private listDetailSubscription: Subscription;

  constructor(
    private listsTableTransformerService: ListsTableTransformerService,
    @Inject('$state') private $state: any,
    private store: Store<AppState>,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
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
        this.storeList = listDetail.listStores.stores;
        this.listSummary = listDetail.listSummary.summaryData;
        this.oppsGroupedByStores = listDetail.listOpportunities.opportunities;

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

        if (listDetail.listOpportunities.opportunitiesStatus === ActionStatus.Fetched) console.log(this.oppsGroupedByStores);
      });
  }

  captureActionButtonClicked(actionButtonProperties: {actionType: string}): void {
    console.log([actionButtonProperties.actionType,  '- Action Button is clicked'].join(' '));
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
    console.log('manage button click');
  }

  public tabSelectedClick(event: TabSelected) {
    this.selectedTab = event.selectedTab;
  }

  public handleListsLinkClick() {
    console.log('list link clicked');
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
}
