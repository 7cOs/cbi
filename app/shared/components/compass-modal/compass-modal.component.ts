import { Component, EventEmitter, HostListener, Input, Output, OnInit, Inject } from '@angular/core';

import { CompassModalInputs } from '../../../models/compass-modal-inputs.model';
import { CompassModalOverlayRef } from './compass-modal.overlayref';
import { COMPASS_MODAL_INPUTS } from '../../components/compass-modal/compass-modal.tokens';

@Component({
  selector: 'compass-modal',
  template: require('./compass-modal.component.pug'),
  styles: [require('./compass-modal.component.scss')]
})

export class CompassModalComponent implements OnInit {
  @Input() body: string;
  @Input() title: string;
  @Output() buttonContainerEvent = new EventEmitter<string>();

  public modalOverlayRef: CompassModalOverlayRef;

  private modalEventEmitter = new EventEmitter<any>();
  private modalInputData: CompassModalInputs;
  private ESCKEY = 27;

  constructor(
    @Inject(COMPASS_MODAL_INPUTS) public modalInputs: CompassModalInputs
  ) { }

  ngOnInit(): void {
    this.modalInputData = {
      body: this.body,
      title: this.title
    };
  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === this.ESCKEY) {
      this.modalOverlayRef.closeModal();
    }
  }

  public hideModal(): void {
    this.buttonContainerEvent.emit('cancel');
    this.modalOverlayRef.closeModal();
  }

  public acceptButtonClick(): void {
    console.log(this.buttonContainerEvent.emit('ok'));
    this.modalOverlayRef.closeModal();
  }
}
