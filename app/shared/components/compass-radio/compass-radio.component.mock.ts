import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassRadioOption } from '../../../models/compass-radio-component.model';

@Component({
  selector: 'compass-radio',
  template: ''
})

export class MockCompassRadioComponent {
  @Output() onRadioClicked = new EventEmitter<any>();

  @Input() model: any;
  @Input() options: Array<CompassRadioOption>;
  @Input() stacked: boolean;
}
