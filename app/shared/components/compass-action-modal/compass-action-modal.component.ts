import { Component, EventEmitter, HostListener, Output, Inject } from '@angular/core';

import { CompassActionModalInputs } from '../../../models/compass-action-modal-inputs.model';
import { CompassActionModalOverlayRef } from './compass-action-modal.overlayref';
import { COMPASS_ACTION_MODAL_INPUTS } from '../../components/compass-action-modal/compass-action-modal.tokens';
import { CompassActionModalEvent } from '../../../enums/compass-action-modal-strings.enum';

const ESCKEY = 27;

@Component({
  selector: 'compass-action-modal',
  template: require('./compass-action-modal.component.pug'),
  styles: [require('./compass-action-modal.component.scss')]
})

export class CompassActionModalComponent {
  @Output() buttonContainerEvent = new EventEmitter<CompassActionModalEvent>();

  public modalOverlayRef: CompassActionModalOverlayRef;
  public compassActionModalEvent = CompassActionModalEvent;

  constructor(
    @Inject(COMPASS_ACTION_MODAL_INPUTS) public modalInputs: CompassActionModalInputs
  ) { }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCKEY) {
      if (this.modalOverlayRef) {
        this.modalOverlayRef.closeModal();
      }
    }
  }

  public hideModal(modalEventString: CompassActionModalEvent): void {
    this.buttonContainerEvent.emit(modalEventString);
    if (this.modalOverlayRef) {
      this.modalOverlayRef.closeModal();
    }
  }
}
