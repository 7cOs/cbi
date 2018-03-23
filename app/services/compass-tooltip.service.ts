import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CompassOverlayConfig } from '../models/compass-overlay-config.model';
import { CompassOverlayPositionConfig } from '../models/compass-overlay-position-config.model';
import { CompassOverlayService } from './compass-overlay.service';
import { CompassTooltipPopupComponent } from '../shared/components/compass-tooltip-popup/compass-tooltip-popup.component';
import { CompassTooltipPopupInputs } from '../models/compass-tooltip-popup-inputs.model';
import { CompassTooltipPopupOverlayRef } from '../shared/components/compass-tooltip-popup/compass-tooltip-popup.overlayref';
import { COMPASS_TOOLTIP_POPUP_INPUTS } from '../shared/components/compass-tooltip-popup/compass-tooltip-popup.token';

@Injectable()
export class CompassTooltipService {

  constructor(
    private compassOverlayService: CompassOverlayService
  ) { }

  public showTooltip(
    tooltipHostElementRef: ElementRef,
    tooltipInputs: CompassTooltipPopupInputs,
    compassPositionConfig: CompassOverlayPositionConfig,
    compassOverlayConfig: CompassOverlayConfig
  ): CompassTooltipPopupOverlayRef {
    const overlayPortalHost: OverlayRef = this.compassOverlayService.getConnectedToOverlayPortalHost(
      tooltipHostElementRef,
      compassPositionConfig,
      compassOverlayConfig
    );
    const tooltipInputPortalInjector: PortalInjector = this.compassOverlayService.getInputPortalInjector(
      COMPASS_TOOLTIP_POPUP_INPUTS,
      tooltipInputs
    );
    const overlayTooltipPopup: CompassTooltipPopupComponent = this.attachTooltipComponent(overlayPortalHost, tooltipInputPortalInjector);

    const tooltipPopupOverlayRef: CompassTooltipPopupOverlayRef = new CompassTooltipPopupOverlayRef(overlayPortalHost);
    tooltipPopupOverlayRef.tooltipPopupInstance = overlayTooltipPopup;

    return tooltipPopupOverlayRef;
  }

  private attachTooltipComponent(portalHost: OverlayRef, tooltipInputs: PortalInjector): CompassTooltipPopupComponent {
    const tooltipPortal: ComponentPortal<CompassTooltipPopupComponent> = new ComponentPortal(
      CompassTooltipPopupComponent,
      null,
      tooltipInputs
    );

    const tooltipRef: ComponentRef<CompassTooltipPopupComponent> = portalHost.attach(tooltipPortal);
    return tooltipRef.instance;
  }
}
