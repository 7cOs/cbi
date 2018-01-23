import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TeamPerformanceTableOpportunity } from '../../../models/my-performance-table-row.model';

@Component({
  selector: 'team-performance-opportunities',
  template: require('./team-performance-opportunities.component.pug'),
  styles: [ require('./team-performance-opportunities.component.scss') ]
})

export class TeamPerformanceOpportunitiesComponent {
  @Output() onCloseIndicatorClicked = new EventEmitter<Event>();
  @Output() onOpportunityCountClicked = new EventEmitter<TeamPerformanceTableOpportunity>();

  @Input() opportunities: Array<TeamPerformanceTableOpportunity>;
  @Input() premiseType: string;
  @Input() productName: string;
  @Input() subtitle: string;
  @Input() total: number;

  @Input() tooltipTitle: string = 'Opportunity Summaries';
  @Input() tooltipPosition: string = 'below';
  @Input() tooltipDescription: string =
    'The opportunity counts shown here are filtered to A and B accounts and High and Medium impact ratings only.' +
    'Please note: for Chain accounts, the opportunity counts on this page are NOT limited to authorized ' +
    'and/or mandated items. To view only authorized and/or mandated opportunities for a chain, ' +
    'proceed to the Opportunities page and apply an Authorization filter.';

  public handleOpportunityCountClicked(opportunity: TeamPerformanceTableOpportunity): void {
    this.onOpportunityCountClicked.emit(opportunity);
  }
}
