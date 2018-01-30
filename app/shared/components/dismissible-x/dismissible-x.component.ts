import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dismissible-x',
  template: require('./dismissible-x.component.pug'),
  styles: [ require('./dismissible-x.component.scss') ]
})

export class DismissibleXComponent {
    @Output() onDismissibleRowXClicked = new EventEmitter<Event>();

    public hoverX: boolean = false;

    public setHoverX(): void {
      this.hoverX = true;
    }

    public unsetHoverX(): void {
      this.hoverX = false;
    }
 }
