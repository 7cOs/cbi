import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/reducers/root.reducer';
import { Title } from '@angular/platform-browser';
import * as ListsActions from '../../state/actions//lists.action';
import { ActionStatus } from '../../enums/action-status.enum';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {

  private storeDetail: Subscription;
  private headerDetail: Subscription;

  constructor(
    private store: Store<AppState>,
    private titleService: Title,
    @Inject('$state') private $state: any,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
    this.store.dispatch(new ListsActions.FetchStoreDetails({listId: '184'}));
    this.store.dispatch(new ListsActions.FetchHeaderDetails({listId: '259'}));

    this.storeDetail = this.store
      .select(state => state.listsDetails)
      .subscribe((storeDetail: any)  => {
        if (storeDetail.status === ActionStatus.Fetched) {
          this.storeDetail = storeDetail;
          console.log(storeDetail);
        }
      });

    this.headerDetail = this.store
      .select(state => state.listsDetails)
      .subscribe((headerDetail: any)  => {
        if (headerDetail.status === ActionStatus.Fetched) {
          this.headerDetail = headerDetail;
          console.log(headerDetail);
        }
      });
  }

  ngOnDestroy() { }
}
