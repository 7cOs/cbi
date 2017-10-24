import { Component, Input, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CssClasses } from '../../../models/css-classes.model';

// tslint:disable-next-line:no-unused-variable
import { BreadcrumbEntityClickedEvent } from '../../../models/breadcrumb-entity-clicked-event.model';
import { MyPerformanceEntitiesData } from '../../../state/reducers/my-performance.reducer';

@Component({
  selector: 'my-performance-breadcrumb',
  template: require('./my-performance-breadcrumb.component.pug'),
  styles: [ require('./my-performance-breadcrumb.component.scss') ]
})

export class MyPerformanceBreadcrumbComponent implements OnChanges {
  @Output() breadcrumbEntityClicked = new EventEmitter<BreadcrumbEntityClickedEvent>();
  @Output() backButtonClicked = new EventEmitter<any>();
  @Input() currentPerformanceState: MyPerformanceEntitiesData;
  @Input() performanceStateVersions: MyPerformanceEntitiesData[];
  @Input() showBackButton: boolean;

  public breadcrumbTrail: string[];

  public ngOnChanges(changes: SimpleChanges) {
    const versions = changes['performanceStateVersions'] ? changes['performanceStateVersions'].currentValue : this.performanceStateVersions;
    const current = changes['currentPerformanceState'] ? changes['currentPerformanceState'].currentValue : this.currentPerformanceState;
    this.breadcrumbTrail = this.constructBreadcrumbTrail(versions, current);
  }

  public getBackButtonClass(): CssClasses {
    return {
      ['back-button']: this.showBackButton
    };
  }

  private constructBreadcrumbTrail(versions: MyPerformanceEntitiesData[], current: MyPerformanceEntitiesData) {
    const versionDescriptions: string[] = versions ?
      versions.map((version: MyPerformanceEntitiesData) => version.selectedEntityDescription) :
      [];
    const currentDescription: string[] = current ? [ current.selectedEntityDescription ] : [];

    return versionDescriptions.concat(currentDescription);
  }
}
