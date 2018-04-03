import { OverlayRef } from '@angular/cdk/overlay';

import { CompassAlertModalComponent } from './compass-alert-modal.component';

export class CompassModalOverlayRef {
  public modalInstance: CompassAlertModalComponent;

  constructor(private overlayRef: OverlayRef) { }

  public closeModal(): void {
    this.overlayRef.dispose();
  }
}
