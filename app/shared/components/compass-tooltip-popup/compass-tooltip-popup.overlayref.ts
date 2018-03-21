import { AnimationEvent } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';

import { CompassTooltipPopupComponent } from './compass-tooltip-popup.component';

export class CompassTooltipPopupOverlayRef {
  public tooltipPopupInstance: CompassTooltipPopupComponent;

  constructor(private overlayRef: OverlayRef) { }

  closeTooltip(): void {
    this.tooltipPopupInstance.popupAnimationStateChanged
      .pipe(filter((event: AnimationEvent) => event.phaseName === 'done'))
      .subscribe(() => this.overlayRef.dispose());

    this.tooltipPopupInstance.startPopupCloseAnimation();
  }
}
