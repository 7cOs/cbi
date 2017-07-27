import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassSelectOption } from '../../../models/compass-select-component.model';

@Component({
  selector: 'compass-select',
  template: ''
})

export class MockCompassSelectComponent {
  @Output() onOptionSelected = new EventEmitter<any>();

  @Input() model: any;
  @Input() options: Array<CompassSelectOption>;
  @Input() title: string;
}
