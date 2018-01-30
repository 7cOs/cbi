import { Component, Input } from '@angular/core';

@Component({
  selector: 'compass-tooltip',
  template: require('./compass-tooltip.component.pug'),
  styles: [require('./compass-tooltip.component.scss')]
})

export class CompassTooltipComponent {

  @Input() title: string;
  @Input() descriptions: Array <string>;
  @Input() position: string;
  @Input() label: string;

  constructor() {}

  ngOnInit () {
    if (this.title) {
      switch (this.position) {
        case 'right':
          this.position = 'title_right';
          break;
        case 'left':
          this.position = 'title_left';
          break;
        case 'above':
          this.position = 'title_above';
          break;
        case '':
        case 'below':
        case undefined:
        default:
          this.position = 'title_below';
      }
    } else {
      switch (this.position) {
        case 'right':
          this.position = 'no_title_right';
          break;
        case 'left':
          this.position = 'no_title_left';
          break;
        case 'above':
          this.position = 'no_title_above';
          break;
        case '':
        case 'below':
        case undefined:
        default:
          this.position = 'no_title_below';
      }
    }
  }
}
