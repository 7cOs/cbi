// import { ActionStatus } from '../../../enums/action-status.enum';
// import { AppState } from '../../../state/reducers/root.reducer';
// import { Subscription } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'compass-tooltip',
  template: require('./compass-tooltip.component.pug'),
  styles: [require('./compass-tooltip.component.scss')]
})

export class CompassTooltipComponent {

  @Output() onToolTipClicked = new EventEmitter<Event>();

  @Input() title: string;
  @Input() description: string;
  @Input() mdDirection?: string;

  // constructor() {}

  public tooltipper(position: string): void {
console.log('position ', position);
  }

  public toggleTooltipClicked(): void {
    this.onToolTipClicked.emit();
  }

//   public optionMainActionClicked(): void {}
}
