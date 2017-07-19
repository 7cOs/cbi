import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'compass-card',
  template: require('./compass-card.component.pug'),
  styles: [require('./compass-card.component.scss')]
})

export class CompassCardComponent {

  @Output() onMainActionClicked = new EventEmitter<any>();

  @Input() title: string;
  @Input() mainAction: string;
  @Input() iconVisible: boolean;

  private optionMainActionClicked(): void { // tslint:disable-line:no-unused-variable
    this.onMainActionClicked.emit();
  }

}
