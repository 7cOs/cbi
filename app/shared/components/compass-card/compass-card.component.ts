import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

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
    private angulartics2: Angulartics2) { }

  public optionMainActionClicked(): void {
    if (this.analyticsProperties) {
      this.angulartics2.eventTrack.next({
        action: 'Link Click',
        properties: this.analyticsProperties
      });
    }
    this.onMainActionClicked.emit();
  }

}
