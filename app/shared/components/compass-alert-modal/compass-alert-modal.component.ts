import { Component, EventEmitter, HostListener, Output, Inject } from '@angular/core';

import { CompassAlertModalInputs } from '../../../models/compass-alert-modal-inputs.model';
import { CompassModalOverlayRef } from './compass-alert-modal.overlayref';
import { COMPASS_ALERT_MODAL_INPUTS } from '../../components/compass-alert-modal/compass-alert-modal.tokens';
import { CompassAlertModalEvent } from '../../../enums/compass-alert-modal-strings.enum';

@Component({
  selector: 'compass-alert-modal',
  template: require('./compass-alert-modal.component.pug'),
  styles: [require('./compass-alert-modal.component.scss')]
})

export class CompassAlertModalComponent {
  @Output() buttonContainerEvent = new EventEmitter<CompassAlertModalEvent>();

  public modalOverlayRef: CompassModalOverlayRef;
  public compassAlertModalEvent = CompassAlertModalEvent;
  private ESCKEY = 27;

  constructor(
    @Inject(COMPASS_ALERT_MODAL_INPUTS) public modalInputs: CompassAlertModalInputs
  ) { }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === this.ESCKEY) {
      if (this.modalOverlayRef) {
        this.modalOverlayRef.closeModal();
      }
    }
  }

  public hideModal(modalEventString: CompassAlertModalEvent): void {
    this.buttonContainerEvent.emit(modalEventString);
    if (this.modalOverlayRef) {
      this.modalOverlayRef.closeModal();
    }
  }
}
