import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

import { CompassOverlayConfig } from '../../../models/compass-overlay-config.model';
import { CompassTooltipPopupInputs } from '../../../models/compass-tooltip-popup-inputs.model';
import { CompassTooltipPopupOverlayRef } from '../compass-tooltip-popup/compass-tooltip-popup.overlayref';
import { CompassOverlayPositionConfig } from '../../../models/compass-overlay-position-config.model';
import { CompassTooltipService } from '../../../services/compass-tooltip.service';

@Component({
  selector: 'compass-tooltip',
  template: `<ng-content></ng-content>`,
})

export class CompassTooltipComponent implements OnInit, OnDestroy {
  @Input() markupString: string;
  @Input() text: string[];
  @Input() title: string;

  private overlayConfig: CompassOverlayConfig = {
    hasBackdrop: false
  };
  private positionConfig: CompassOverlayPositionConfig = {
    originConnectionPosition: { originX: 'center', originY: 'bottom' },
    overlayConnectionPosition: { overlayX: 'center', overlayY: 'top' },
    overlayOffsetX: 0,
    overlayOffsetY: 5
  };
  private tooltipPopupInputData: CompassTooltipPopupInputs;
  private tooltipPopupOverlayRef: CompassTooltipPopupOverlayRef;

  constructor(
    private compassTooltipService: CompassTooltipService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.tooltipPopupInputData = {
      markupString: this.markupString,
      text: this.text,
      title: this.title
    };
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.hideTooltip();
  }

  public showTooltip(): void {
    this.tooltipPopupOverlayRef = this.compassTooltipService.showTooltip(
      this.elementRef,
      this.tooltipPopupInputData,
      this.positionConfig,
      this.overlayConfig
    );
  }

  public hideTooltip(): void {
    if (this.tooltipPopupOverlayRef) this.tooltipPopupOverlayRef.closeTooltip();
  }
}
