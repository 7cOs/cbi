import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'compass-card',
  template: require('./compass-card.component.pug'),
  styles: [require('./compass-card.component.scss')]
})

export class CompassCardComponent {

  @Output() onMainActionClicked = new EventEmitter<any>();

  @Input() analyticsProperties?: {label: string, category: string};
  @Input() title: string;
  @Input() mainAction: string;
  @Input() iconVisible: boolean;

  constructor(
    private analyticsService: AnalyticsService) { }

  public optionMainActionClicked(): void {
    if (this.analyticsProperties) {
      this.analyticsService.trackEvent(
        this.analyticsProperties.category,
        'Link Click',
        this.analyticsProperties.label
      );
    }
    this.onMainActionClicked.emit();
  }

}
