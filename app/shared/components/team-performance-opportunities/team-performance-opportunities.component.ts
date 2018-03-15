import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassTooltipPopupInputs } from '../../../models/compass-tooltip-popup-inputs.model';
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
  @Input() tooltip: CompassTooltipPopupInputs;
  @Input() premiseType: string;
  @Input() productName: string;
  @Input() subtitle: string;
  @Input() total: number;

  public handleOpportunityCountClicked(opportunity: TeamPerformanceTableOpportunity): void {
    this.onOpportunityCountClicked.emit(opportunity);
  }
}
