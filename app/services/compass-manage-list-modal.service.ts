import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CompassOverlayConfig } from '../models/compass-overlay-config.model';
import { CompassOverlayService } from './compass-overlay.service';

import { CompassModalOverlayRef } from '../shared/components/compass-alert-modal/compass-alert-modal.overlayref';
import { CompassManageListModalInputs } from '../models/compass-manage-list-modal-inputs.model';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from '../shared/components/compass-manage-list-modal/compass-manage-list-modal.tokens';
import { CompassManageListModalComponent } from '../shared/components/compass-manage-list-modal/compass-manage-list-modal.component';
import { CompassManageListModalOverlayRef } from '../shared/components/compass-manage-list-modal/compass-manage-list-modal.overlayref';

@Injectable()
export class CompassManageListModalService {

  constructor(
    private compassOverlayService: CompassOverlayService
  ) { }

  public modalActionBtnContainerEvent(modalComponentInstance: CompassManageListModalComponent): Promise<{}> {
    return modalComponentInstance.buttonContainerEvent.first( ( result: any) => {
      return result;
    } ).toPromise();
  }

  public showManageListModalDialog(
    modalInputs: CompassManageListModalInputs,
    compassOverlayConfig: CompassOverlayConfig
  ): CompassManageListModalOverlayRef {
    const defaultOverlayConfig = {hasBackdrop: true};
    const combinedOverlayConfig = Object.assign({}, defaultOverlayConfig, compassOverlayConfig);
    const overlayPortalHost: OverlayRef = this.compassOverlayService.getCenteredOverlayPortalHost(combinedOverlayConfig);
    const modalInputPortalInjector: PortalInjector = this.compassOverlayService.getInputPortalInjector(
      COMPASS_MANAGE_LIST_MODAL_INPUTS,
      modalInputs
    );
    const modalComponentInstance: CompassManageListModalComponent = this.attachManageModalComponent(
      overlayPortalHost, modalInputPortalInjector);
    const modalOverlayRef: CompassManageListModalOverlayRef = new CompassManageListModalOverlayRef(overlayPortalHost);

    overlayPortalHost.backdropClick().subscribe(() => modalOverlayRef.closeModal());
    modalOverlayRef.modalInstance = modalComponentInstance;
    modalComponentInstance.modalOverlayRef = modalOverlayRef;

    return modalOverlayRef;
  }

  private attachManageModalComponent(portalHost: OverlayRef, modalInputs: PortalInjector): CompassManageListModalComponent {
    const modalPortal: ComponentPortal<CompassManageListModalComponent> = new ComponentPortal(
      CompassManageListModalComponent,
      null,
      modalInputs
    );

    const modalRef: ComponentRef<CompassManageListModalComponent> = portalHost.attach(modalPortal);
    return modalRef.instance;
  }
}
