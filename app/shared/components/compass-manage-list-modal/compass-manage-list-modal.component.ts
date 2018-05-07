import { Component, EventEmitter, HostListener, Output, Inject, Input } from '@angular/core';

import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { CompassManageListModalOverlayRef } from './compass-manage-list-modal.overlayref';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from '../../components/compass-manage-list-modal/compass-manage-list-modal.tokens';
import { CompassManageListModalEvent } from '../../../enums/compass-manage-list-modal-strings.enum';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ListsSummary } from '../../../models/lists/lists-header.model';
import { CompassAlertModalEvent } from '../../../enums/compass-alert-modal-strings.enum';
import { CompassModalService } from '../../../services/compass-modal.service';

const ESCKEY = 27;

@Component({
  selector: 'compass-manage-list-modal',
  template: require('./compass-manage-list-modal.component.pug'),
  styles: [require('./compass-manage-list-modal.component.scss')]
})

export class CompassManageListModalComponent {
  @Output() buttonContainerEvent = new EventEmitter<ListsSummary>();
  public modalOverlayRef: CompassManageListModalOverlayRef;
  public compassManageListModalEvent = CompassManageListModalEvent;
  public listForm: FormGroup;
  public collaborators: Array<object> = [];
  public archiveModalStringInputs = {
    'title': 'Are you sure?',
    'body': 'By archiving this list, only limited set functionality will remain available.',
    'rejectLabel': 'Cancel',
    'acceptLabel': 'Archive'};
  public deleteModalStringInputs =  {
    'title': 'Are you sure?',
    'body': 'Deleting a list cannot be undone. You\'ll lose all list store performance and opportunity progress.',
    'rejectLabel': 'Cancel',
    'acceptLabel': 'Delete'
  };

  constructor(
    @Inject(COMPASS_MANAGE_LIST_MODAL_INPUTS) public modalInputs: CompassManageListModalInputs,
    @Inject('searchService') private searchService: any,
    private fb: FormBuilder,
    public compassModalService: CompassModalService
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

      this.collaborators = Object.assign([], modalInputs.listObject.collaborators);
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
    this.collaborators.push(collaborator);
  }

  public convertFormPayload(): ListsSummary {
    let payload = Object.assign({}, this.modalInputs.listObject);
    payload.name = this.listForm.get('targetName').value;
    payload.description = this.listForm.get('description').value;
    payload.collaborators = this.collaborators;
    return payload;
  }
  public hideModal(modalEventString: CompassManageListModalEvent): void {
    if ( modalEventString === CompassManageListModalEvent.Accept) {
      this.buttonContainerEvent.emit(this.convertFormPayload());
    }
    if (this.modalOverlayRef) {
      this.modalOverlayRef.closeModal();
    }
  }

  public showArchiveModal() {
    let compassModalOverlayRef = this.compassModalService.showAlertModalDialog(this.archiveModalStringInputs, {});
      this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value) => {
      if (value === CompassAlertModalEvent.Accept) {
        console.log('hit archive');
      }
    });
  }

  public showDeleteModal() {
    let compassModalOverlayRef = this.compassModalService.showAlertModalDialog(this.deleteModalStringInputs, {});
    this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value) => {
      if (value === CompassAlertModalEvent.Accept) {
        console.log('hit delete');
      }
    });
  }

}
