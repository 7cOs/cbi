import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TeamPerformanceTableOpportunity } from '../../../models/my-performance-table-row.model';
import { CompassTooltipObject } from '../../../models/compass-tooltip-component.model';

@Component({
  selector: 'team-performance-opportunities',
  template: require('./team-performance-opportunities.component.pug'),
  styles: [ require('./team-performance-opportunities.component.scss') ]
})

export class TeamPerformanceOpportunitiesComponent {
  @Output() onCloseIndicatorClicked = new EventEmitter<Event>();
  @Output() onOpportunityCountClicked = new EventEmitter<TeamPerformanceTableOpportunity>();

  @Input() opportunities: Array<TeamPerformanceTableOpportunity>;
  @Input() tooltip: CompassTooltipObject;
  @Input() premiseType: string;
  @Input() productName: string;
  @Input() subtitle: string;
  @Input() total: number;

  public handleOpportunityCountClicked(opportunity: TeamPerformanceTableOpportunity): void {
    this.onOpportunityCountClicked.emit(opportunity);
  }
}
