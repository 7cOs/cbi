import { Component, Input } from '@angular/core';
// import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'my-performance-breadcrumb',
  template: require('./my-performance-breadcrumb.component.pug'),
  styles: [ require('./my-performance-breadcrumb.component.scss') ]
})

export class MyPerformanceBreadcrumbComponent {
  @Input() breadcrumbTrail: string[];

  constructor() { }
}
