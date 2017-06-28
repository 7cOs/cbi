import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'greeting',
  template: require('./greeting.component.pug'),
  styles: [ require('./greeting.component.scss') ]
})

export class GreetingComponent implements OnInit {
  @Input() name: string;

  private salutation: string;

  constructor() {}

  ngOnInit() {
    const hour: number = moment().hour();

    if (hour < 12) this.salutation = 'Good morning';
    else if (hour >= 12 && hour < 17) this.salutation = 'Good afternoon';
    else if (hour >= 17 && hour <= 23) this.salutation = 'Good evening';
  }
}
