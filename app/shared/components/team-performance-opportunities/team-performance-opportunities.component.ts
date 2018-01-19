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

  private tooltipPosition: string;
  private tooltipTitle: string;
  private tooltipDescription: string;

  ngOnInit() {
    this.tooltipTitle = 'Opportunity Summaries';
    this.tooltipPosition = 'below';
    this.tooltipDescription =
    'The opportunity counts shown here are filtered to A and B accounts and High and Medium impact ratings only.';
  }

  public handleOpportunityCountClicked(opportunity: TeamPerformanceTableOpportunity): void {
    this.onOpportunityCountClicked.emit(opportunity);
  }
}
