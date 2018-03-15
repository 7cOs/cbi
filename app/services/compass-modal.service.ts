import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CompassOverlayConfig } from '../models/compass-overlay-config.model';
import { CompassOverlayPositionConfig } from '../models/compass-overlay-position-config.model';
import { CompassOverlayService } from './compass-overlay.service';
import { CompassModalComponent } from '../shared/components/compass-modal/compass-modal.component';
import { CompassModalInputs } from '../models/compass-modal-inputs.model';
import { CompassModalOverlayRef } from '../shared/components/compass-modal/compass-modal.overlayref';
import { COMPASS_MODAL_INPUTS } from '../shared/components/compass-modal/compass-modal.tokens';

@Injectable()
export class CompassModalService {

  constructor(
    private compassOverlayService: CompassOverlayService
  ) { }

  public showModalDialog(
    modalInputs: CompassModalInputs,
    compassOverlayConfig: CompassOverlayConfig
  ): CompassModalOverlayRef {
    const overlayPortalHost: OverlayRef = this.compassOverlayService.getCenteredOverlayPortalHost(compassOverlayConfig);

    const modalInputPortalInjector: PortalInjector = this.compassOverlayService.getInputPortalInjector(
      COMPASS_MODAL_INPUTS,
      modalInputs
    );
    const overlayModal: CompassModalComponent = this.attachModalComponent(overlayPortalHost, modalInputPortalInjector);

    const modalOverlayRef: CompassModalOverlayRef = new CompassModalOverlayRef(overlayPortalHost);
    modalOverlayRef.modalInstance = overlayModal;

    return modalOverlayRef;
  }

  private attachModalComponent(portalHost: OverlayRef, modalInputs: PortalInjector): CompassModalComponent {
    const modalPortal: ComponentPortal<CompassModalComponent> = new ComponentPortal(
      CompassModalComponent,
      null,
      modalInputs
    );

    const modalRef: ComponentRef<CompassModalComponent> = portalHost.attach(modalPortal);
    return modalRef.instance;
  }
}
