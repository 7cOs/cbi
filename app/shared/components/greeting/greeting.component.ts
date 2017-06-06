import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'greeting',
  template: require('./greeting.component.pug'),
  styles: [require('./greeting.component.scss')]
})

export class GreetingComponent implements OnInit {
  @Input() name: string;

  public salutation: string;

  constructor() {}

  ngOnInit() {
    const hours: number = (new Date()).getHours();

    if (hours < 12) this.salutation = 'Good morning';
    else if (hours >= 12 && hours < 17) this.salutation = 'Good afternoon';
    else if (hours >= 17 && hours <= 23) this.salutation = 'Good evening';
  }
}
