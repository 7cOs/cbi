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
  public compassManageListModalEvent = CompassManageListModalEvent;
  public listForm: FormGroup;
  public pendingCollaborators: Array<object> = [];

  constructor(
    @Inject(COMPASS_MANAGE_LIST_MODAL_INPUTS) public modalInputs: CompassManageListModalInputs,
    @Inject('searchService') private searchService: any,
    private fb: FormBuilder
  ) {
    if (modalInputs.listObject) {
      this.listForm = this.fb.group({
        targetName: modalInputs.listObject.name,
        description: modalInputs.listObject.description,
        userSearchTerm: ''
      });

      this.listForm.setValue({
        targetName: modalInputs.listObject.name,
        description: modalInputs.listObject.description,
        userSearchTerm: ''
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

  public addCollaborator(collaborator: object) {
    this.pendingCollaborators.push(collaborator);
  }

  public transformFormPayload() {
    let collaboratorsObj = Object.assign(this.modalInputs.listObject.collaborators, this.pendingCollaborators);
    return Object.assign(this.listForm.value, {'collaborators': collaboratorsObj});
  }
  public hideModal(modalEventString: CompassManageListModalEvent): void {
    if ( modalEventString === CompassManageListModalEvent.Accept) {
      this.buttonContainerEvent.emit(this.transformFormPayload());
    } else {
      this.buttonContainerEvent.emit(modalEventString);
    }
    if (this.modalOverlayRef) {
      this.modalOverlayRef.closeModal();
    }
  }

  public changeListPermission() {
    console.log('change list permissions!');
  }
}
