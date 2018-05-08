import { Component, EventEmitter, HostListener, Output, Inject, OnInit } from '@angular/core';

import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from '../../components/compass-manage-list-modal/compass-manage-list-modal.tokens';
import { CompassManageListModalEvent } from '../../../enums/compass-manage-list-modal-strings.enum';
import { CompassManageListModalOverlayRef } from './compass-manage-list-modal.overlayref';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListsSummary } from '../../../models/lists/lists-header.model';

const ESCKEY: number = 27;

@Component({
  selector: 'compass-manage-list-modal',
  template: require('./compass-manage-list-modal.component.pug'),
  styles: [require('./compass-manage-list-modal.component.scss')]
})

export class CompassManageListModalComponent implements OnInit {
  @Output() buttonContainerEvent = new EventEmitter<ListsSummary>();

  public modalOverlayRef: CompassManageListModalOverlayRef;
  public compassManageListModalEvent = CompassManageListModalEvent;
  public listForm: FormGroup;
  public collaborators: Array<object> = [];

  constructor(
    @Inject(COMPASS_MANAGE_LIST_MODAL_INPUTS) public modalInputs: CompassManageListModalInputs,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.listForm = this.fb.group({
      targetName: this.modalInputs.listObject.name,
      description: this.modalInputs.listObject.description,
      userSearchTerm: ''
    });

    this.listForm.setValue({
      targetName: this.modalInputs.listObject.name,
      description: this.modalInputs.listObject.description,
      userSearchTerm: ''
    });

    this.collaborators = Object.assign([], this.modalInputs.listObject.collaborators);
  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCKEY) this.modalOverlayRef.closeModal();
  }

  public addCollaborator(collaborator: object) {
    this.collaborators.push(collaborator);
  }

  public convertFormPayload(): ListsSummary {
    return Object.assign({}, this.modalInputs.listObject, {
      name: this.listForm.get('targetName').value,
      description: this.listForm.get('description').value,
      collaborators: this.collaborators
    });
  }

  public hideModal(modalEventString: CompassManageListModalEvent): void {
    if (modalEventString === CompassManageListModalEvent.Accept) this.buttonContainerEvent.emit(this.convertFormPayload());
    this.modalOverlayRef.closeModal();
  }
}
