import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CssClasses } from '../../../models/css-classes.model';

// tslint:disable-next-line:no-unused-variable
import { BreadcrumbEntityClickedEvent } from '../../../models/breadcrumb-entity-clicked-event.model';
import { MyPerformanceEntitiesData } from '../../../state/reducers/my-performance.reducer';

@Component({
  selector: 'my-performance-breadcrumb',
  template: require('./my-performance-breadcrumb.component.pug'),
  styles: [ require('./my-performance-breadcrumb.component.scss') ]
})

export class MyPerformanceBreadcrumbComponent {
  @Output() breadcrumbEntityClicked = new EventEmitter<BreadcrumbEntityClickedEvent>();
  @Output() backButtonClicked = new EventEmitter<any>();
  @Input() currentUserFullName: string;
  @Input()
  set performanceStateVersions (versions: MyPerformanceEntitiesData[]) {
    this.breadcrumbTrail = [ this.currentUserFullName ]
      .concat(versions.map((version: MyPerformanceEntitiesData) => version.selectedEntity));
  }
  @Input() showBackButton: boolean;

  public breadcrumbTrail: string[];

  public getBackButtonClass(): CssClasses {
    return {
      ['back-button']: this.showBackButton
    };
  }
}
