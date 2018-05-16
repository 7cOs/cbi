import { Component, EventEmitter, HostListener, Output, Inject, OnInit } from '@angular/core';

import { CompassActionModalInputs } from '../../../models/compass-action-modal-inputs.model';
import { CompassActionModalOutputs } from '../../../models/compass-action-modal-outputs.model';
import { CompassActionModalOverlayRef } from './compass-action-modal.overlayref';
import { COMPASS_ACTION_MODAL_INPUTS } from '../../components/compass-action-modal/compass-action-modal.tokens';
import { CompassActionModalEvent } from '../../../enums/compass-action-modal-strings.enum';
import { DropdownInputModel } from '../../../models/compass-dropdown-input.model';
import { ListsDownloadType } from '../../../enums/lists/list-download-type.enum';
import { RadioInputModel } from '../../../models/compass-radio-input.model';

// just for example - remove this when working with real data
import { listOpportunityStatusOptions } from '../../../models/list-opportunities/list-opportunity-status-options.model';

const ESCKEY = 27;

@Component({
  selector: 'compass-action-modal',
  template: require('./compass-action-modal.component.pug'),
  styles: [require('./compass-action-modal.component.scss')]
})

export class CompassActionModalComponent implements OnInit {
  @Output() buttonContainerEvent = new EventEmitter<CompassActionModalOutputs>();

  public modalOverlayRef: CompassActionModalOverlayRef;
  public compassActionModalEvent = CompassActionModalEvent;
  public radioInputModel: RadioInputModel;
  public dropdownInputModel: DropdownInputModel;
  public radioOptionSelected: string;
  public dropdownOptionSelected: string;

  constructor(
    @Inject(COMPASS_ACTION_MODAL_INPUTS) public modalInputs: CompassActionModalInputs
  ) { }

  ngOnInit() {
    this.radioOptionSelected = ListsDownloadType.Stores;
    this.dropdownOptionSelected = 'All';
    this.radioInputModel = this.modalInputs.radioInputModel ? this.modalInputs.radioInputModel : null;
    // this.dropdownInputModel = this.modalInputs.dropdownInputModel ? this.modalInputs.dropdownInputModel : null;

    // just for example - remove all this logic and uncomment the above line when sending real data
    this.dropdownInputModel = {
      selected: 'All',
      dropdownOptions: listOpportunityStatusOptions,
      title: 'List'
    };
  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCKEY) {
      if (this.modalOverlayRef) {
        this.modalOverlayRef.closeModal();
      }
    }
  }

  public onRadioSelected(optionSelected: string) {
    this.radioOptionSelected = optionSelected;
  }

  public onDropdownSelected(optionSelected: string) {
    this.dropdownOptionSelected = optionSelected;
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
}
