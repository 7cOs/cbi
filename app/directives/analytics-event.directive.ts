import { Directive, Input, ElementRef, AfterContentInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { AnalyticsService } from '../services/analytics.service';

@Directive({
  selector: '[analyticsEvent]'
})
export class AnalyticsEventDirective implements AfterContentInit {
  @Input('analyticsEvent') analyticsEvent: string;
  @Input() category: string;
  @Input() action: string;
  @Input() label: string;

  private el: HTMLElement;

  constructor(
    private elRef: ElementRef,
    private analyticsService: AnalyticsService,
    private eventManager: EventManager
  ) {
    this.el = this.elRef.nativeElement;
  }

  ngAfterContentInit() {
    this.eventManager.addEventListener(this.el, this.analyticsEvent || 'click', () => this.eventTrack());
  }

  public eventTrack() {
    this.analyticsService.trackEvent(this.category, this.action, this.label);
  }
}
