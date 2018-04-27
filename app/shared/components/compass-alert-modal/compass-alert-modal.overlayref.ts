import { OverlayRef } from '@angular/cdk/overlay';

import { CompassAlertModalComponent } from './compass-alert-modal.component';
import { CompassManageListModalComponent } from '../compass-manage-list-modal/compass-manage-list-modal.component';

export class CompassModalOverlayRef {
  public modalInstance: CompassAlertModalComponent;

  constructor(private overlayRef: OverlayRef) { }

  public closeModal(): void {
    this.overlayRef.dispose();
  }
}
