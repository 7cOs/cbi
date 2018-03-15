import { AnimationEvent } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';

import { CompassModalComponent } from './compass-modal.component';

export class CompassModalOverlayRef {
  public modalInstance: CompassModalComponent;

  constructor(private overlayRef: OverlayRef) { }

  closeModal(): void {
    // this.modalInstance.modalEventEmitter.subscribe(() => this.overlayRef.dispose() );
    this.overlayRef.dispose();
  }
}
