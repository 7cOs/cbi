import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'greeting',
  template: require('./greeting.component.pug')
})
export class GreetingComponent implements OnInit {

  // TODO: Figure out ordering of inputs, outputs, etc?
  // TODO: should we explicitly label public, private, etc?
  // TODO: Move styles into component scss if needed (look for greeting class being used in template currently)
  // TODO: Add title-casing in here
  // TODO: unit test
  // TODO: cleanup

  @Input() name: string;

  salutation: string;

  constructor() { }

  ngOnInit() {
    const hours: number = (new Date()).getHours();

    if (hours < 12) {
      this.salutation = 'Good morning';
    } else if (hours >= 12 && hours <= 17) {
      this.salutation = 'Good afternoon';
    } else if (hours >= 17 && hours <= 24) {
      this.salutation = 'Good evening';
    }
  }
}
