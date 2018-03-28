import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/reducers/root.reducer';
import { Title } from '@angular/platform-browser';
import * as ListsActions from '../../state/actions//lists.action';
import { ActionStatus } from '../../enums/action-status.enum';
import { Subscription } from 'rxjs/Subscription';
import { ListsState } from '../../state/reducers/lists.reducer';
import { StoreDetailsRow, StoreHeaderDetails } from '../../models/lists.model';

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {
  public storeList: StoreDetailsRow[];
  public listHeader: StoreHeaderDetails;
  private listDetailSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private titleService: Title,
    @Inject('$state') private $state: any,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
    this.store.dispatch(new ListsActions.FetchStoreDetails({listId: '184'}));
    this.store.dispatch(new ListsActions.FetchHeaderDetails({listId: '259'}));

    this.listDetailSubscription = this.store
      .select(state => state.listsDetails)
      .subscribe((listDetail: ListsState)  => {
        if (listDetail.status === ActionStatus.Fetched) {
          this.storeList = listDetail.stores;
        }
        if (listDetail.headerInfoStatus === ActionStatus.Fetched) {
          this.listHeader = listDetail.headerInfo;
        }
      });
  }

  ngOnDestroy() { }
}
