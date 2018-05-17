import { OverlayRef } from '@angular/cdk/overlay';

import { CompassActionModalComponent } from './compass-action-modal.component';

export class CompassActionModalOverlayRef {
  public modalInstance: CompassActionModalComponent;

  constructor(private overlayRef: OverlayRef) { }

  public closeModal(): void {
    this.overlayRef.dispose();
  }
}
