import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassTooltipPopupInputs } from '../../../models/compass-tooltip-popup-inputs.model';

@Component({
  selector: 'compass-table-extender-header',
  template: require('./compass-table-extender-header.component.pug'),
  styles: [ require('./compass-table-extender-header.component.scss') ]
})

export class CompassTableExtenderHeaderComponent {
  @Output() onCloseIndicatorClicked = new EventEmitter<Event>();

  @Input() mainTitle: string;
  @Input() tooltip: CompassTooltipPopupInputs;
  @Input() subtitle: string;
}
