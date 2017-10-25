import { Component, Input, EventEmitter, OnChanges, Output, SimpleChanges, OnInit } from '@angular/core';
import { CssClasses } from '../../../models/css-classes.model';

import { BreadcrumbEntityClickedEvent } from '../../../models/breadcrumb-entity-clicked-event.model';
import { MyPerformanceEntitiesData } from '../../../state/reducers/my-performance.reducer';

@Component({
  selector: 'my-performance-breadcrumb',
  template: require('./my-performance-breadcrumb.component.pug'),
  styles: [ require('./my-performance-breadcrumb.component.scss') ]
})

export class MyPerformanceBreadcrumbComponent implements OnChanges, OnInit {
  @Output() breadcrumbEntityClicked = new EventEmitter<BreadcrumbEntityClickedEvent>();
  @Output() backButtonClicked = new EventEmitter<any>();
  @Input() currentPerformanceState: MyPerformanceEntitiesData;
  @Input() performanceStateVersions: MyPerformanceEntitiesData[];
  @Input() showBackButton: boolean;

  public breadcrumbTrail: string[];

  public ngOnInit() {
    this.breadcrumbTrail = this.constructBreadcrumbTrail(this.performanceStateVersions, this.currentPerformanceState);
  }

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

  public handleEntityClicked(entityDescription: string) {
    const evt: BreadcrumbEntityClickedEvent = {
      trail: this.breadcrumbTrail,
      entityDescription: entityDescription
    };
    this.breadcrumbEntityClicked.emit(evt);
  }

  private constructBreadcrumbTrail(versions: MyPerformanceEntitiesData[], current: MyPerformanceEntitiesData) {
    const versionDescriptions: string[] = versions
      ? versions.map((version: MyPerformanceEntitiesData) => version.selectedEntityDescription)
      : [];
    const currentDescription: string[] = current ? [ current.selectedEntityDescription ] : [];

    return versionDescriptions.concat(currentDescription);
  }
}
