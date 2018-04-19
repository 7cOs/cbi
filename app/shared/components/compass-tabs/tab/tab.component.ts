import { Component, Input } from '@angular/core';

@Component({
  selector: 'compass-tab',
  template: require('./tab.component.pug')
})
export class CompassTabComponent {
  @Input('tabTitle') title: string;
  @Input() active: boolean = false;
}
