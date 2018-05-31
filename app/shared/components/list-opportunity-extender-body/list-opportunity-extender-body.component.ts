import { Component, Input, OnDestroy, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/reducers/root.reducer';
import { Subscription } from 'rxjs/Subscription';
import { ListsOpportunities } from '../../../models/lists/lists-opportunities.model';
import { ListsState } from '../../../state/reducers/lists.reducer';
import { OpportunitiesByStore } from '../../../models/lists/opportunities-by-store.model';
import { OpportunityType } from '../../../enums/list-opportunities/list-opportunity-type.enum';
import { FormatOpportunitiesTypePipe } from '../../../pipes/formatOpportunitiesType.pipe';

@Component({
  selector: 'list-opportunity-extender-body',
  template: require('./list-opportunity-extender-body.component.pug'),
  styles: [ require('./list-opportunity-extender-body.component.scss') ]
})

export class ListOpportunityExtenderBodyComponent implements OnDestroy, OnChanges {
  @Input() opportunitySelected: string;
  @Input() unversionedStoreId: string;

  public opportunityDetails: ListsOpportunities;
  public opportunityType: string;
  public allOpps: OpportunitiesByStore;
  public skuDescription: string;

  public featureTypeCode: string;
  public itemAuthorizationCode: string;

  private listDetailSubscription: Subscription;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.listDetailSubscription = this.store
      .select(state => state.listsDetails)
      .subscribe((listDetail: ListsState)  => {
          this.allOpps = listDetail.listOpportunities.opportunities;
      });
  }

  ngOnChanges() {
    this.setExtenderBodyFields(this.allOpps);
  }

  setExtenderBodyFields(allOpps: OpportunitiesByStore) {
    if (allOpps) {
      this.opportunityDetails = allOpps[this.unversionedStoreId] ?
                                  allOpps[this.unversionedStoreId].find((el: ListsOpportunities) => {
                                    return el.id === this.opportunitySelected;
                                  }) : null;
      if (this.opportunityDetails) {
        this.opportunityType =  this.opportunityTypeConversion(this.opportunityDetails);
        this.skuDescription =  this.opportunityDetails.isSimpleDistribution ? 'ANY' : this.opportunityDetails.skuDescription;
      }
    }
  }

  opportunityTypeConversion(opportunityRow: ListsOpportunities): string {
    if (opportunityRow.type === OpportunityType.MANUAL) {
      return new FormatOpportunitiesTypePipe().transform(opportunityRow.subType);
    } else {
      return opportunityRow.type;
    }
  }

  ngOnDestroy() {
    this.listDetailSubscription.unsubscribe();
  }
}
