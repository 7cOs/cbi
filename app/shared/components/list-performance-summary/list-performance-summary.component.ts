import { Component, Input, OnChanges } from '@angular/core';
import { CompassListClassUtilService } from '../../../services/compass-list-class-util.service';

@Component({
  selector: 'list-performance-summary',
  template: require('./list-performance-summary.component.pug'),
  styles: [require('./list-performance-summary.component.scss')]
})
export class ListPerformanceSummaryComponent implements OnChanges {
  @Input() depletionsTotal: number;
  @Input() depletionsVsYA: number;
  @Input() distributionsTotal: number;
  @Input() distributionsVsYA: number;

  public depletionsTitle: string = 'DEPLETIONS CYTD';
  public distributionsTitle: string = 'EFFECTIVE POD L90';
  public depletionsVsYAColorClass: string;
  public distributionsVsYAColorClass: string;

  constructor(private classUtilService: CompassListClassUtilService) {}

  ngOnChanges(): void {
    this.depletionsVsYAColorClass = this.getPercentColorClass(
      this.depletionsVsYA
    );
    this.distributionsVsYAColorClass = this.getPercentColorClass(
      this.distributionsVsYA
    );
  }

  public getPercentColorClass(percent: number): string {
    percent = percent || 0;
    return this.classUtilService.getTrendClass(percent);
  }
}
