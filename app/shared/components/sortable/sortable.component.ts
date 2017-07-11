import { Component, Input } from '@angular/core';
@Component({
  selector: 'sortable',
  template: require('./sortable.component.pug'),
  styles: [ require('./sortable.component.scss') ]
})

export class SortableComponent {
  @Input() active: boolean;
  @Input() ascending: boolean;
}
