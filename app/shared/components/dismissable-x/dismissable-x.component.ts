import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dismissable-x',
  template: require('./dismissable-x.component.pug'),
  styles: [ require('./dismissable-x.component.scss') ]
})

export class DismissableXComponent {
    @Output() onDismissableRowXClicked = new EventEmitter<Event>();

    public hoverX: boolean = false;

    public setHoverX(): void {
      this.hoverX = true;
    }

    public unsetHoverX(): void {
      this.hoverX = false;
    }
 }
