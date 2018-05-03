import { Component, Input, OnDestroy, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/reducers/root.reducer';
import { Subscription } from 'rxjs/Subscription';
import { ListsOpportunities } from '../../../models/lists/lists-opportunities.model';
import { ListsState } from '../../../state/reducers/lists.reducer';
import { OpportunityType } from '../../../enums/list-opportunities/list-opportunity-type.enum';
import { OpportunityTypeLabel } from '../../../enums/list-opportunities/list-opportunity-type-label.enum';
import { OpportunitiesByStore } from '../../../models/lists/opportunities-by-store.model';

@Component({
  selector: 'list-opportunity-extender-body',
  template: require('./list-opportunity-extender-body.component.pug'),
  styles: [ require('./list-opportunity-extender-body.component.scss') ]
})

export class ListOpportunityExtenderBodyComponent implements OnDestroy, OnChanges {
  @Input() opportunitySelected: string;
  @Input() unversionedStoreId: string;

  public opportunityDetails: ListsOpportunities;
  public opportunityType: OpportunityTypeLabel | OpportunityType;
  public allOpps: OpportunitiesByStore;
  private listDetailSubscription: Subscription;

  constructor(private store: Store<AppState>) {
  }

  ngOnChanges() {
    this.listDetailSubscription = this.store
      .select(state => state.listsDetails)
      .subscribe((listDetail: ListsState)  => {
          this.allOpps = listDetail.listOpportunities.opportunities;
          this.setExtenderBodyFields(this.allOpps);
      });
  }

  setExtenderBodyFields(allOpps: OpportunitiesByStore) {
    this.opportunityDetails = allOpps[this.unversionedStoreId] ?
                                allOpps[this.unversionedStoreId].find((el: any) => {
                                  return el.id === this.opportunitySelected;
                                }) : null;
    this.opportunityType =  this.opportunityDetails ?
                              OpportunityTypeLabel[this.opportunityDetails.type] || this.opportunityDetails.type
                              : null;
  }

  ngOnDestroy() {
    this.listDetailSubscription.unsubscribe();
  }
}
