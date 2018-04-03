import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CompassOverlayConfig } from '../models/compass-overlay-config.model';
import { CompassOverlayService } from './compass-overlay.service';
import { CompassAlertModalComponent } from '../shared/components/compass-alert-modal/compass-alert-modal.component';
import { CompassAlertModalInputs } from '../models/compass-alert-modal-inputs.model';
import { CompassModalOverlayRef } from '../shared/components/compass-alert-modal/compass-alert-modal.overlayref';
import { COMPASS_ALERT_MODAL_INPUTS } from '../shared/components/compass-alert-modal/compass-alert-modal.tokens';

@Injectable()
export class CompassModalService {

  constructor(
    private compassOverlayService: CompassOverlayService
  ) { }

  public showAlertModalDialog(
    modalInputs: CompassAlertModalInputs,
    compassOverlayConfig: CompassOverlayConfig
  ): CompassModalOverlayRef {
    const defaultOverlayConfig = {hasBackdrop: true};
    const combinedOverlayConfig = Object.assign({}, defaultOverlayConfig, compassOverlayConfig);
    const overlayPortalHost: OverlayRef = this.compassOverlayService.getCenteredOverlayPortalHost(combinedOverlayConfig);
    const modalInputPortalInjector: PortalInjector = this.compassOverlayService.getInputPortalInjector(
      COMPASS_ALERT_MODAL_INPUTS,
      modalInputs
    );
    const modalComponentInstance: CompassAlertModalComponent = this.attachModalComponent(overlayPortalHost, modalInputPortalInjector);
    const modalOverlayRef: CompassModalOverlayRef = new CompassModalOverlayRef(overlayPortalHost);

    overlayPortalHost.backdropClick().subscribe(() => modalOverlayRef.closeModal());
    modalOverlayRef.modalInstance = modalComponentInstance;
    modalComponentInstance.modalOverlayRef = modalOverlayRef;

    return modalOverlayRef;
  }

  public modalActionBtnContainerEvent(modalComponentInstance: CompassAlertModalComponent): Promise<{}> {
    return modalComponentInstance.buttonContainerEvent.first( ( result: any) => {
      return result;
    } ).toPromise();
  }

  private attachModalComponent(portalHost: OverlayRef, modalInputs: PortalInjector): CompassAlertModalComponent {
    const modalPortal: ComponentPortal<CompassAlertModalComponent> = new ComponentPortal(
      CompassAlertModalComponent,
      null,
      modalInputs
    );

    const modalRef: ComponentRef<CompassAlertModalComponent> = portalHost.attach(modalPortal);
    return modalRef.instance;
  }
}
