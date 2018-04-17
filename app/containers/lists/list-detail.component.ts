import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { ActionButtonType } from '../../enums/action-button-type.enum';
// TODO: Remove this when we get real data.
import { getListPerformanceTableRowMock,
  getListPerformanceHeaderRowMock } from '../../models/list-performance/list-performance-table-row.model.mock';
import { AppState } from '../../state/reducers/root.reducer';
import * as ListsActions from '../../state/actions//lists.action';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsState } from '../../state/reducers/lists.reducer';
import { StoreDetails } from '../../models/lists/lists-store.model';

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
  public tableData = getListPerformanceTableRowMock(1000);
  public tableHeader = getListPerformanceHeaderRowMock();
  public totalRow = {
    storeColumn: 'Total',
    distributorColumn: '',
    segmentColumn: '',
    cytdColumn: 0,
    cytdVersusYaColumn: 1,
    cytdVersusYaPercentColumn: 2,
    l90Column: 3,
    l90VersusYaColumn: 4,
    l90VersusYaPercentColumn: 5,
    lastDepletionDate: '',
    performanceError: false
  };
  public actionButtonType: any = ActionButtonType;
  private listDetailSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private titleService: Title,
    @Inject('$state') private $state: any,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
    this.store.dispatch(new ListsActions.FetchStoreDetails({listId: this.$state.params.id}));
    this.store.dispatch(new ListsActions.FetchHeaderDetails({listId: this.$state.params.id}));

    this.listDetailSubscription = this.store
      .select(state => state.listsDetails)
      .subscribe((listDetail: ListsState)  => {
          this.storeList = listDetail.listStores.stores;
          this.listSummary = listDetail.listSummary.summaryData;
      });
  }

  captureActionButtonClicked(actionButtonProperties: {actionType: string}): void {
    console.log([actionButtonProperties.actionType,  '- Action Button is clicked'].join(' '));
  }

  ngOnDestroy() {
    this.listDetailSubscription.unsubscribe();
  }
}
