import { Component, Input } from '@angular/core';

@Component({
  selector: 'compass-tab',
  styles: [require('./tab.component.scss')],
  template: require('./tab.component.pug')
})
export class TabComponent {
  @Input('tabTitle') title: string;
  @Input() active: boolean = false;
}
