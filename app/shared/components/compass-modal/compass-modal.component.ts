import { Component, EventEmitter, HostListener, Output, Inject } from '@angular/core';

import { CompassModalInputs } from '../../../models/compass-modal-inputs.model';
import { CompassModalOverlayRef } from './compass-modal.overlayref';
import { COMPASS_MODAL_INPUTS } from '../../components/compass-modal/compass-modal.tokens';

@Component({
  selector: 'compass-modal',
  template: require('./compass-modal.component.pug'),
  styles: [require('./compass-modal.component.scss')]
})

export class CompassModalComponent {
  @Output() buttonContainerEvent = new EventEmitter<string>();

  public modalOverlayRef: CompassModalOverlayRef;
  private ESCKEY = 27;

  constructor(
    @Inject(COMPASS_MODAL_INPUTS) public modalInputs: CompassModalInputs
  ) { }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === this.ESCKEY) {
      this.modalOverlayRef.closeModal();
    }
  }

  public hideModal(buttonLabel: string): void {
    this.buttonContainerEvent.emit(buttonLabel);
    this.modalOverlayRef.closeModal();
  }
}
