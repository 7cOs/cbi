import { Component, EventEmitter, HostListener, Output, Inject, OnInit } from '@angular/core';

import { CompassActionModalInputs } from '../../../models/compass-action-modal-inputs.model';
import { CompassActionModalOutputs } from '../../../models/compass-action-modal-outputs.model';
import { CompassActionModalOverlayRef } from './compass-action-modal.overlayref';
import { COMPASS_ACTION_MODAL_INPUTS } from '../../components/compass-action-modal/compass-action-modal.tokens';
import { CompassActionModalEvent } from '../../../enums/compass-action-modal-event.enum';
import { DropdownInputModel } from '../../../models/compass-dropdown-input.model';
import { RadioInputModel } from '../../../models/compass-radio-input.model';

const ESCKEY = 27;

@Component({
  selector: 'compass-action-modal',
  template: require('./compass-action-modal.component.pug'),
  styles: [require('./compass-action-modal.component.scss')]
})

export class CompassActionModalComponent implements OnInit {
  @Output() buttonContainerEvent = new EventEmitter<CompassActionModalOutputs>();

  public compassActionModalEvent = CompassActionModalEvent;
  public dropdownInputModel: DropdownInputModel;
  public dropdownOptionSelected: string;
  public isAcceptEnabled: boolean = false;
  public modalOverlayRef: CompassActionModalOverlayRef;
  public radioInputModel: RadioInputModel;
  public radioOptionSelected: string;
  public isCopyButtonEnabled: boolean = false;

  constructor(
    @Inject(COMPASS_ACTION_MODAL_INPUTS) public modalInputs: CompassActionModalInputs
  ) { }

  ngOnInit() {
    this.radioInputModel = this.modalInputs.radioInputModel ? this.modalInputs.radioInputModel : null;
    this.dropdownInputModel = this.modalInputs.dropdownInputModel ? this.modalInputs.dropdownInputModel : null;
    if (this.radioInputModel) {
      this.radioOptionSelected = this.radioInputModel.selected;
    }
    if (this.dropdownInputModel) {
      this.dropdownOptionSelected = this.dropdownInputModel.selected;
    }
    this.isAcceptEnabled = this.getActionButtonEnabled();
  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCKEY) {
      if (this.modalOverlayRef) {
        this.modalOverlayRef.closeModal();
      }
    }
  }

  public onRadioSelected(optionSelected: string): void {
    this.radioOptionSelected = optionSelected;
  }

  public onDropdownSelected(optionSelected: string): void {
    this.dropdownOptionSelected = optionSelected;
    this.isAcceptEnabled = this.getActionButtonEnabled();
  }

  public optionsSelected() {
    return {
      radioOptionSelected: this.radioOptionSelected,
      dropdownOptionSelected: this.dropdownOptionSelected
    };
  }

  public hideModal(modalEventString: CompassActionModalEvent): void {
    if (modalEventString === CompassActionModalEvent.Accept) this.buttonContainerEvent.emit(this.optionsSelected());
    if (this.modalOverlayRef) {
      this.modalOverlayRef.closeModal();
    }
  }

  private getActionButtonEnabled(): boolean {
    return ( this.radioInputModel
        && this.radioOptionSelected
        && !this.dropdownInputModel )
      ||
        ( this.dropdownInputModel
        && this.dropdownInputModel.dropdownOptions.length
        && this.dropdownOptionSelected !== this.dropdownInputModel.dropdownOptions[0].value);
  }
}
