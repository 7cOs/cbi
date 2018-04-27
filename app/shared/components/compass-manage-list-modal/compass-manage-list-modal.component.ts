import { Component, EventEmitter, HostListener, Output, Inject, Input } from '@angular/core';

import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { CompassManageListModalOverlayRef } from './compass-manage-list-modal.overlayref';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from '../../components/compass-manage-list-modal/compass-manage-list-modal.tokens';
import { CompassManageListModalEvent } from '../../../enums/compass-manage-list-modal-strings.enum';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';

const ESCKEY = 27;

@Component({
  selector: 'compass-manage-list-modal',
  template: require('./compass-manage-list-modal.component.pug'),
  styles: [require('./compass-manage-list-modal.component.scss')]
})

export class CompassManageListModalComponent {
  @Output() buttonContainerEvent = new EventEmitter<CompassManageListModalEvent>();

  public modalOverlayRef: CompassManageListModalOverlayRef;
  public compassAlertModalEvent = CompassManageListModalEvent;
  public listForm: FormGroup;

  constructor(
    @Inject(COMPASS_MANAGE_LIST_MODAL_INPUTS) public modalInputs: CompassManageListModalInputs,
    private fb: FormBuilder
  ) {

    if (modalInputs.listObject) {
      this.listForm = this.fb.group({
        name: modalInputs.listObject.name,
        description: modalInputs.listObject.description
      });

      this.listForm.setValue({
        name: modalInputs.listObject.name,
        description: modalInputs.listObject.description
      });
    }

  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCKEY) {
      if (this.modalOverlayRef) {
        this.modalOverlayRef.closeModal();
      }
    }
  }

  public hideModal(modalEventString: CompassManageListModalEvent): void {
    this.buttonContainerEvent.emit(modalEventString);
    if (this.modalOverlayRef) {
      this.modalOverlayRef.closeModal();
    }
  }
}

interface BaseList {
  archived: boolean;
  collaborators: Collaborator[];
  createdOn: string;
  description: string;
  id: string;
  name: string;
  numberOfAccounts: number;
  numberOfClosedOpportunities: number;
  owner: User;
  survey: any;
  totalOpportunities: number;
  type: string;
  updatedOn: string;
}

interface Collaborator {
  lastViewed: string;
  permissionLevel: string;
  user: User;
}

interface User {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  id?: string;
}
