import { Component, Input } from '@angular/core';

@Component({
  selector: 'compass-tooltip',
  template: require('./compass-tooltip.component.pug'),
  styles: [require('./compass-tooltip.component.scss')]
})

export class CompassTooltipComponent {

  @Input() title?: string;
  @Input() description: string;
  @Input() position?: string;
  @Input() label?: string;

  constructor() {}

  ngOnInit () {
  }
}
