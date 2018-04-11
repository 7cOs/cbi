import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { AppState } from '../../state/reducers/root.reducer';
import * as ListsActions from '../../state/actions//lists.action';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsState } from '../../state/reducers/lists.reducer';
import { StoreDetails } from '../../models/lists/lists-store.model';
import { ActionStatus } from '../../enums/action-status.enum';

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {
  public storeList: StoreDetails[];
  public listSummary: ListsSummary;
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
          if (listDetail.listStores.storeStatus === ActionStatus.Fetched) {
            this.storeList = listDetail.listStores.stores;
          }
        if (listDetail.listSummary.summaryStatus === ActionStatus.Fetched) {
          this.listSummary = listDetail.listSummary.summaryData;
        }
      });
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
}
