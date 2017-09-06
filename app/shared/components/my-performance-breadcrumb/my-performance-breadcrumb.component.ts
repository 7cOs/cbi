import { Component, Input, EventEmitter, Output } from '@angular/core';

// tslint:disable-next-line:no-unused-variable
import { BreadcrumbEntityClickedEvent } from '../../../models/breadcrumb-entity-clicked-event.model';
import { MyPerformanceData, MyPerformanceState } from '../../../state/reducers/my-performance.reducer';

@Component({
  selector: 'my-performance-breadcrumb',
  template: require('./my-performance-breadcrumb.component.pug'),
  styles: [ require('./my-performance-breadcrumb.component.scss') ]
})

export class MyPerformanceBreadcrumbComponent {
  @Output() breadcrumbEntityClicked = new EventEmitter<BreadcrumbEntityClickedEvent>();
  @Input() currentUserFullName: string;
  @Input()
  set performanceState (performanceState: MyPerformanceState) {
    const { current, versions } = performanceState;
    this.breadcrumbTrail = [ this.currentUserFullName ]
      .concat(versions.map((version: MyPerformanceData) => version.selectedEntity));
  }

  public breadcrumbTrail: string[];
}
