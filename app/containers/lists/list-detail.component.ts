import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { ActionButtonType } from '../../enums/action-button-type.enum';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import * as ListsActions from '../../state/actions//lists.action';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { StoreDetails } from '../../models/lists/lists-store.model';
import {
  getListOpportunitiesHeaderRowMock,
  getListOpportunitiesTableRowMock
} from '../../models/list-opportunities/list-opportunities-table-row.model.mock';

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {
  public storeList: StoreDetails[];
  public listSummary: ListsSummary;
  public firstTabTitle: string = 'Performance';
  public secondTabTitle: string = 'Opportunities';

  // TODO: Remove this when we get real data.
  public opportunitiesTableData = getListOpportunitiesTableRowMock(25);
  public opportunitiesTableHeader = getListOpportunitiesHeaderRowMock();

  public actionButtonType: any = ActionButtonType;
  public performanceTableHeader: string[] = ['Store', 'Distributor', 'Segment', 'Depeletions', ' Effective POD', 'Last Depletion'];
  public performanceTableTotal: ListPerformanceTableRow;
  public performanceTableData: ListPerformanceTableRow[];

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
        }
      });
  }

  captureActionButtonClicked(actionButtonProperties: {actionType: string}): void {
    console.log([actionButtonProperties.actionType,  '- Action Button is clicked'].join(' '));
  }

  ngOnDestroy() {
    this.listDetailSubscription.unsubscribe();
  }

  public handleManageButtonClick() {
    console.log('manage button click');
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
