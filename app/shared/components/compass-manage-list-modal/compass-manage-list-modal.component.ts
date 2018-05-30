import { Component, EventEmitter, HostListener, Inject, OnInit, Output } from '@angular/core';

import { CollaboratorOwnerDetails } from '../../../models/lists/collaborator-owner-details.model';
import { CompassAlertModalEvent } from '../../../enums/compass-alert-modal-strings.enum';
import { CompassAlertModalInputs } from '../../../models/compass-alert-modal-inputs.model';
import { CompassDropdownData } from '../../../models/compass-dropdown-data.model';
import { CompassManageListModalEvent } from '../../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from '../../components/compass-manage-list-modal/compass-manage-list-modal.tokens';
import { CompassManageListModalOutput } from '../../../models/compass-manage-list-modal-output.model';
import { CompassManageListModalOverlayRef } from './compass-manage-list-modal.overlayref';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListManageModalDropdownEvent } from '../../../enums/lists/list-manage-modal-dropdown-event.enum';
import { ListsSummary } from '../../../models/lists/lists-header.model';
import { MANAGE_LIST_ALERT_MODAL_TEXT } from '../../../models/lists/manage-list-alert-modal-text.model';

const ESCKEY: number = 27;

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
  public collaborators: CollaboratorOwnerDetails[];

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
  private collaboratorDropdownData: CompassDropdownData = {
    data: [{ display: 'Remove Collaborator', value: ListManageModalDropdownEvent.Remove_Collaborator }],
    styles: { width: 340 }
  };
  private currentUserEmployeeId: string;
  private newListOwnerEmployeeId: string = '';

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

    this.currentUserEmployeeId = this.modalInputs.currentUser.employeeId;
    this.currentUserIsListOwner = this.currentUserEmployeeId === this.modalInputs.listObject.ownerId;
    this.collaborators = this.modalInputs.listObject.collaborators.map((collaborator: CollaboratorOwnerDetails) => collaborator);
    this.availableTitleCharacterCount = this.MAX_TITLE_LENGTH - this.modalInputs.listObject.name.length;
    this.availableDescriptionCharacterCount = this.modalInputs.listObject.description
      ? this.MAX_DESCRIPTION_LENGTH - this.modalInputs.listObject.description.length
      : this.MAX_DESCRIPTION_LENGTH;

    if (this.currentUserIsListOwner) {
      this.collaboratorDropdownData.data.push({
        display: 'Transfer Ownership of this List',
        value: ListManageModalDropdownEvent.Transfer_Ownership
      });
    }
  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCKEY) this.modalOverlayRef.closeModal();
  }

  public addCollaborator(collaboratorDTO: any) {
    if (collaboratorDTO.employeeId !== this.currentUserEmployeeId) {
      const collaborator: CollaboratorOwnerDetails = {
        employeeId: collaboratorDTO.employeeId,
        firstName: collaboratorDTO.firstName,
        lastName: collaboratorDTO.lastName
      };

      this.collaborators.push(collaborator);
    }
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
        type: CompassManageListModalEvent.Save,
        selectedEmployeeId: ''
      });
    }

    this.modalOverlayRef.closeModal();
  }

  public showAlertModal(manageModalEventType: CompassManageListModalEvent): void {
    this.alertModalData = Object.assign({}, this.alertModalData, {
      body: MANAGE_LIST_ALERT_MODAL_TEXT[manageModalEventType].body,
      acceptLabel: MANAGE_LIST_ALERT_MODAL_TEXT[manageModalEventType].acceptLabel
    });
    this.isAlertModalOpen = true;
    this.currentAlertModalType = manageModalEventType;
  }

  public alertModalClicked(event: CompassAlertModalEvent): void {
    if (event === CompassAlertModalEvent.Accept) {
      this.buttonContainerEvent.emit({
        listSummary: this.convertFormPayload(),
        type: this.currentAlertModalType,
        selectedEmployeeId: this.newListOwnerEmployeeId
      });
      this.modalOverlayRef.closeModal();
    } else {
      this.newListOwnerEmployeeId = '';
    }

    this.isAlertModalOpen = false;
  }

  public nameInputChange(modalName: string): void {
    this.availableTitleCharacterCount = this.MAX_TITLE_LENGTH - modalName.length;
  }

  public descriptionInputChange(modalDescription: string): void {
    this.availableDescriptionCharacterCount = this.MAX_DESCRIPTION_LENGTH - modalDescription.length;
  }

  public collaboratorDropdownClicked(dropdownEvent: ListManageModalDropdownEvent, selectedCollaborator: CollaboratorOwnerDetails): void {
    if (dropdownEvent === ListManageModalDropdownEvent.Remove_Collaborator) {
      this.collaborators = this.collaborators.filter((collaborator: CollaboratorOwnerDetails) => {
        return collaborator.employeeId !== selectedCollaborator.employeeId;
      });
    } else if (dropdownEvent === ListManageModalDropdownEvent.Transfer_Ownership) {
      this.newListOwnerEmployeeId = selectedCollaborator.employeeId;
      this.showAlertModal(CompassManageListModalEvent.Transfer_Ownership);
    }
  }
}
