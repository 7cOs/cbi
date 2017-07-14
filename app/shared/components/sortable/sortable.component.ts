// tslint:disable:no-unused-variable
import { Component, Input } from '@angular/core';

import { SortStatus } from '../../../enums/sort-status.enum';

@Component({
  selector: 'sortable',
  template: require('./sortable.component.pug'),
  styles: [ require('./sortable.component.scss') ]
})

export class SortableComponent {
  @Input() status: SortStatus;

  private sortStatus = SortStatus; // for use in template;
}
