import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';

import { CompassManageListModalComponent } from './compass-manage-list-modal.component';
import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from './compass-manage-list-modal.tokens';
import { CompassManageListModalEvent } from '../../../enums/compass-manage-list-modal-strings.enum';
import { ListsSummary } from '../../../models/lists/lists-header.model';
import { User, CollaboratorOwnerDetails } from '../../../models/lists/lists.model';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CompassModalService } from '../../../services/compass-modal.service';

const chance = new Chance();
const modalOverlayRefMock = {
  closeModal: jasmine.createSpy('closeModal')
};

fdescribe('Compass Manage Modal List Component', () => {
  let fixture: ComponentFixture<CompassManageListModalComponent>;
  let componentInstance: CompassManageListModalComponent;
  let fixtureDebugElement: DebugElement;
  let compassModalInputsMock: CompassManageListModalInputs;
  let compassModalService: CompassModalService;
  let formBuilder: FormBuilder = new FormBuilder();

  let titleInputMock: string;
  let acceptLabelMock: string;
  let rejectLabelMock: string;
  let listObjectMock: ListsSummary;
  let currentUserMock: User;
  let searchServiceMock = {
    getUsers: getUsers,
    setSearchActive: setSearchActive
  };

  function getUsers (value: string) {
    return new Promise((resolve, reject) => {
      resolve([{value: 'test'}]);
    });
  }
  function setSearchActive() {
    return true;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ CompassManageListModalComponent ],
      providers: [
        {
          provide: COMPASS_MANAGE_LIST_MODAL_INPUTS,
          userValue: compassModalInputsMock
        },
        {
          provide: FormBuilder,
          useValue: formBuilder
        },
        {
          provide: 'searchService',
          useValue: searchServiceMock
        },
        {
          provide: CompassModalService,
          useValue: compassModalService
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    titleInputMock = chance.string();
    acceptLabelMock = chance.string();
    rejectLabelMock = chance.string();
    currentUserMock = {
      firstName: 'Bob',
      lastName: 'Bobby',
      employeeId: chance.string()
    };
    listObjectMock = {
        archived: false,
        description: chance.string(),
        id: chance.string(),
        name: chance.string(),
        closedOpportunities: null,
        totalOpportunities: null,
        numberOfAccounts: null,
        ownerFirstName: chance.string(),
        ownerLastName: chance.string(),
        collaborators: [],
        ownerId: chance.string(),
        collaboratorType: null,
        category: null,
        type: null
    };

    compassModalInputsMock = {
      title: titleInputMock,
      acceptLabel: acceptLabelMock,
      rejectLabel: rejectLabelMock,
      listObject: listObjectMock,
      currentUser: currentUserMock
    };

    fixture = TestBed.createComponent(CompassManageListModalComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.listForm = formBuilder.group({targetName: '', description: '', userSearchTerm: ''});
    componentInstance.modalInputs = compassModalInputsMock;
    componentInstance.modalOverlayRef = modalOverlayRefMock as any;
    fixtureDebugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  describe('Compass Manage List Modal Inputs', () => {
    it('should contain a title element when the injection has a title', () => {
      let titleElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-title'));
      expect(titleElement.nativeElement.textContent).toEqual(compassModalInputsMock.title);

      componentInstance.modalInputs.title = undefined;
      fixture.detectChanges();
      titleElement = fixture.debugElement.query(By.css('.compass-modal-title'));
      expect(titleElement.nativeElement.textContent).toEqual('');
    });
    it('should contain a cancel button element when the injection has a cancel button string', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-btn'));
      expect(buttonElement.nativeElement.textContent).toEqual(compassModalInputsMock.rejectLabel);
    });
    it('should contain an accept button element when the injection has an accept button string', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));
      expect(buttonElement.nativeElement.textContent).toEqual(compassModalInputsMock.acceptLabel);
    });
  });

  describe('Compass Manage List Modal Outputs', () => {
    it('should output an accept message when the accept button is clicked', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));
      componentInstance.buttonContainerEvent.subscribe((value: object) => {
        expect(value).toEqual(listObjectMock);
      });

      buttonElement.nativeElement.click();
      expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();

    });
  });
  describe('Compass Manage List Modal Add Collaborator', () => {
    it('should output an accept message when the accept button is clicked', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));
      componentInstance.addCollaborator({employeeId: chance.string(),
        firstName: chance.string(),
        lastName: chance.string()
      });
      componentInstance.buttonContainerEvent.subscribe((value: ListsSummary) => {
        expect(value.collaborators.length).toEqual(1);
      });

      buttonElement.nativeElement.click();
      expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();

    });
  });
});
