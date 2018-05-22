import { Component, EventEmitter, HostListener, Inject, OnInit, Output } from '@angular/core';

import { CompassAlertModalEvent } from '../../../enums/compass-alert-modal-strings.enum';
import { CompassAlertModalInputs } from '../../../models/compass-alert-modal-inputs.model';
import { CompassManageListModalEvent } from '../../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from '../../components/compass-manage-list-modal/compass-manage-list-modal.tokens';
import { CompassManageListModalOutput } from '../../../models/compass-manage-list-modal-output.model';
import { CompassManageListModalOverlayRef } from './compass-manage-list-modal.overlayref';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListsSummary } from '../../../models/lists/lists-header.model';

const ESCKEY: number = 27;
const ALERT_MODAL_TEXT = {
  [CompassManageListModalEvent.Delete]: {
    body: 'Deleting a list cannot be undone. You’ll lose all list store performance and opportunity progress.',
    acceptLabel: 'DELETE'
  },
  [CompassManageListModalEvent.Archive]: {
    body: `Are you sure you want to archive this list?`,
    acceptLabel: 'ARCHIVE'
  },
  [CompassManageListModalEvent.Leave]: {
    body: `Are you sure you want to leave this list?`,
    acceptLabel: 'LEAVE'
  }
};

@Component({
  selector: 'compass-manage-list-modal',
  template: require('./compass-manage-list-modal.component.pug'),
  styles: [require('./compass-manage-list-modal.component.scss')]
})
export class CompassManageListModalComponent implements OnInit {
  @Output() buttonContainerEvent = new EventEmitter<CompassManageListModalOutput>();

  public alertModalType = CompassManageListModalEvent;
  public modalOverlayRef: CompassManageListModalOverlayRef;
  public compassManageListModalEvent = CompassManageListModalEvent;
  public listForm: FormGroup;
  public collaborators: Array<object> = [];

  private alertModalData: CompassAlertModalInputs = {
    title: 'Are you sure?',
    body: '',
    acceptLabel: '',
    rejectLabel: 'CANCEL'
  };
  private currentAlertModalType: CompassManageListModalEvent;
  private isAlertModalOpen: boolean = false;
  private currentUserIsListOwner: boolean = false;
  private MAX_TITLE_LENGTH: number = 40;
  private MAX_DESCRIPTION_LENGTH: number = 255;
  private availableTitleCharacterCount: number = 40;
  private availableDescriptionCharacterCount: number = 255;

  constructor(
    @Inject(COMPASS_MANAGE_LIST_MODAL_INPUTS) public modalInputs: CompassManageListModalInputs,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.listForm = this.fb.group({
      targetName: this.modalInputs.listObject.name,
      description: this.modalInputs.listObject.description || '',
      userSearchTerm: ''
    });

    this.listForm.setValue({
      targetName: this.modalInputs.listObject.name,
      description: this.modalInputs.listObject.description || '',
      userSearchTerm: ''
    });

    this.collaborators = this.modalInputs.listObject.collaborators.map((collaborator: object) => collaborator);
    this.currentUserIsListOwner = this.modalInputs.currentUser.employeeId === this.modalInputs.listObject.ownerId;
    this.availableTitleCharacterCount = this.MAX_TITLE_LENGTH - this.modalInputs.listObject.name.length;
    this.availableDescriptionCharacterCount = this.MAX_DESCRIPTION_LENGTH - this.modalInputs.listObject.description.length;
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

  public hideModal(manageListModalEvent: CompassManageListModalEvent): void {
    if (manageListModalEvent === CompassManageListModalEvent.Save) {
      this.buttonContainerEvent.emit({
        listSummary: this.convertFormPayload(),
        type: CompassManageListModalEvent.Save
      });
    }

    this.modalOverlayRef.closeModal();
  }

  public showAlertModal(manageModalEventType: CompassManageListModalEvent): void {
    this.alertModalData = Object.assign({}, this.alertModalData, {
      body: ALERT_MODAL_TEXT[manageModalEventType].body,
      acceptLabel: ALERT_MODAL_TEXT[manageModalEventType].acceptLabel
    });
    this.isAlertModalOpen = true;
    this.currentAlertModalType = manageModalEventType;
  }

  public alertModalClicked(event: CompassAlertModalEvent): void {
    if (event === CompassAlertModalEvent.Accept) {
      this.buttonContainerEvent.emit({
        listSummary: this.convertFormPayload(),
        type: this.currentAlertModalType
      });
      this.modalOverlayRef.closeModal();
    }

    this.isAlertModalOpen = false;
  }

  public nameInputChange(modalName: string): void {
    this.availableTitleCharacterCount = this.MAX_TITLE_LENGTH - modalName.length;
  }

  public descriptionInputChange(modalDescription: string): void {
    this.availableDescriptionCharacterCount = this.MAX_DESCRIPTION_LENGTH - modalDescription.length;
  }
}
