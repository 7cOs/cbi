import { Component, Input } from '@angular/core';

import { SortStatus } from '../../../enums/sort-status.enum';

@Component({
  selector: 'sort-indicator',
  template: require('./sort-indicator.component.pug'),
  styles: [ require('./sort-indicator.component.scss') ]
})

export class SortIndicatorComponent {
  @Input() status: SortStatus;

  public sortStatus = SortStatus;
}
