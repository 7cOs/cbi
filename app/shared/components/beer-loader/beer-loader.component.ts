import { Component } from '@angular/core';

@Component({
  selector: 'beer-loader',
  template: require('./beer-loader.component.pug'),
  styles: [ require('./beer-loader.component.scss') ]
})
export class BeerLoaderComponent {

  constructor() {}
}
