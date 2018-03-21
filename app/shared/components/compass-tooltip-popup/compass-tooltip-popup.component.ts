import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject } from '@angular/core';
import { animate, AnimationEvent, state, style, transition, trigger  } from '@angular/animations';

import { CompassTooltipPopupInputs } from '../../../models/compass-tooltip-popup-inputs.model';
import { COMPASS_TOOLTIP_POPUP_INPUTS } from './compass-tooltip-popup.token';

@Component({
  selector: 'compass-tooltip-popup',
  template: require('./compass-tooltip-popup.component.pug'),
  styles: [require('./compass-tooltip-popup.component.scss')],
  animations: [
    trigger('scaleAnimation', [
      state('scaleIn', style({ transform: 'scale(1)', 'transform-origin': 'bottom' })),
      state('scaleOut', style({ transform: 'scale(0.1)', 'transform-origin': 'top' })),
      transition('scaleOut => scaleIn', animate('100ms ease-in')),
      transition('scaleIn => scaleOut', animate('100ms ease-out'))
    ])
  ]
})

export class CompassTooltipPopupComponent implements AfterViewInit {
  public popupAnimationStateChanged = new EventEmitter<AnimationEvent>();

  private currentScaleAnimation: string = 'scaleOut';

  constructor(
    @Inject(COMPASS_TOOLTIP_POPUP_INPUTS) public tooltipInputs: CompassTooltipPopupInputs,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.currentScaleAnimation = 'scaleIn';
    this.changeDetectorRef.detectChanges();
  }

  public onScaleAnimationDone(event: AnimationEvent): void {
    this.popupAnimationStateChanged.emit(event);
  }

  public startPopupCloseAnimation(): void {
    this.currentScaleAnimation = 'scaleOut';
  }
}
