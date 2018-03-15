import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Inject } from '@angular/core';

import { CompassOverlayConfig } from '../../../models/compass-overlay-config.model';
import { CompassModalInputs } from '../../../models/compass-modal-inputs.model';
import { CompassModalOverlayRef } from '../compass-modal/compass-modal.overlayref';
import { CompassOverlayPositionConfig } from '../../../models/compass-overlay-position-config.model';
import { CompassModalService } from '../../../services/compass-modal.service';
import { COMPASS_MODAL_INPUTS } from '../../components/compass-modal/compass-modal.tokens';

@Component({
  selector: 'compass-modal',
  template: `<ng-content><div>test</div></ng-content>`,
})

export class CompassModalComponent implements OnInit, OnDestroy {
  @Input() body: string;
  @Input() title: string;

  private overlayConfig: CompassOverlayConfig = {
    hasBackdrop: true
  };
  private positionConfig: CompassOverlayPositionConfig = {
    originConnectionPosition: { originX: 'center', originY: 'center' },
    overlayConnectionPosition: { overlayX: 'center', overlayY: 'center' },
    overlayOffsetX: 0,
    overlayOffsetY: 0
  };
  private modalInputData: CompassModalInputs;
  private modalOverlayRef: CompassModalOverlayRef;

  constructor(
    @Inject(COMPASS_MODAL_INPUTS) public modalInputs: CompassModalInputs,
    private compassModalService: CompassModalService,
  ) { }

  ngOnInit(): void {
    this.modalInputData = {
      body: this.body,
      title: this.title
    };
  }

  ngOnDestroy(): void {
    this.hideModal();
  }

  public showModal(): void {
    this.modalOverlayRef = this.compassModalService.showModalDialog(
      this.modalInputData,
      this.positionConfig,
      this.overlayConfig
    );
  }

  public hideModal(): void {
    if (this.modalOverlayRef) this.modalOverlayRef.closeModal();
  }
}
