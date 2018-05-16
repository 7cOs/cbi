import { OverlayRef } from '@angular/cdk/overlay';

import { CompassManageListModalComponent } from './compass-manage-list-modal.component';

export class CompassManageListModalOverlayRef {
  public modalInstance: CompassManageListModalComponent;

  constructor(private overlayRef: OverlayRef) { }

  public closeModal(): void {
    this.overlayRef.dispose();
  }
}
