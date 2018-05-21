import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Optional, Output  } from '@angular/core';

import { CompassAlertModalInputs } from '../../../models/compass-alert-modal-inputs.model';
import { CompassModalOverlayRef } from './compass-alert-modal.overlayref';
import { COMPASS_ALERT_MODAL_INPUTS } from '../../components/compass-alert-modal/compass-alert-modal.tokens';
import { CompassAlertModalEvent } from '../../../enums/compass-alert-modal-strings.enum';

const ESCKEY = 27;

@Component({
  selector: 'compass-alert-modal',
  template: require('./compass-alert-modal.component.pug'),
  styles: [require('./compass-alert-modal.component.scss')]
})

export class CompassAlertModalComponent implements OnInit {
  @Output() buttonContainerEvent = new EventEmitter<CompassAlertModalEvent>();

  @Input() modalData: CompassAlertModalInputs;

  public modalOverlayRef: CompassModalOverlayRef;
  public compassAlertModalEvent = CompassAlertModalEvent;

  private displayData: CompassAlertModalInputs;

  constructor(
    @Optional()
    @Inject(COMPASS_ALERT_MODAL_INPUTS) public modalInputs: CompassAlertModalInputs
  ) { }

  ngOnInit() {
    this.displayData = this.modalInputs || this.modalData;
  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCKEY) {
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
