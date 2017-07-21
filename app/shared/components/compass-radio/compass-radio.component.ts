import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassRadioOption } from '../../../models/compass-radio-component.model';

@Component({
  selector: 'compass-radio',
  template: require('./compass-radio.component.pug'),
  styles: [require('./compass-radio.component.scss')]
})

export class CompassRadioComponent {
  @Output() onRadioClicked = new EventEmitter<any>();

  @Input() model: any;
  @Input() options: Array<CompassRadioOption>;
  @Input() stacked: boolean;
  @Input() title?: string;

  private radioClicked(option: CompassRadioOption): void { // tslint:disable-line:no-unused-variable
    this.onRadioClicked.emit(option.value);
  }
}
