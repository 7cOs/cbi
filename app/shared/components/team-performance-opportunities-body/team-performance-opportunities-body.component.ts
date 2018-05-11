import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TeamPerformanceTableOpportunity } from '../../../models/my-performance-table-row.model';

@Component({
  selector: 'team-performance-opportunities-body',
  template: require('./team-performance-opportunities-body.component.pug'),
  styles: [ require('./team-performance-opportunities-body.component.scss') ]
})

export class TeamPerformanceOpportunityBodyComponent {
  @Input() premiseType: string;
  @Input() productName: string;
  @Input() opportunities: Array<TeamPerformanceTableOpportunity>;
  @Input() total: number;

  @Output() onOpportunityCountClicked = new EventEmitter<TeamPerformanceTableOpportunity>();

  public handleOpportunityCountClicked(opportunity: TeamPerformanceTableOpportunity): void {
    this.onOpportunityCountClicked.emit(opportunity);
  }
}
