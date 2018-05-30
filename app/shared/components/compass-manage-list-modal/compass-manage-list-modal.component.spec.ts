import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CompassActionButtonComponent } from '../compass-action-button/compass-action-button.component';
import { CompassAlertModalComponent } from '../compass-alert-modal/compass-alert-modal.component';
import { CompassDropdownDirective } from '../../../directives/compass-dropdown.directive';
import { CompassDropdownService } from '../../../services/compass-dropdown.service';
import { CompassManageListModalComponent } from './compass-manage-list-modal.component';
import { CompassManageListModalEvent } from '../../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { CompassManageListModalOutput } from '../../../models/compass-manage-list-modal-output.model';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from './compass-manage-list-modal.tokens';
import { CompassModalService } from '../../../services/compass-modal.service';
import { CompassUserSearchComponent } from '../compass-user-search/compass-user-search.component';
import { getListsSummaryMock } from '../../../models/lists/lists-header.model.mock';

const chance = new Chance();

const searchServiceMock = {
  getUsers: jasmine.createSpy('getUsers').and.callFake((arg: any) => {
    return new Promise((resolve, reject) => {
      resolve([{
        value: 'test'
      }]);
    });
  }),
  setSearchActive: jasmine.createSpy('setSearchActive').and.callFake((arg: any) => {
    return true;
  })
};

describe('Compass Manage Modal List Component', () => {
  let fixture: ComponentFixture<CompassManageListModalComponent>;
  let componentInstance: CompassManageListModalComponent;

  let compassModalServiceMock: CompassModalService;
  let compassDropdownServiceMock: CompassDropdownService;
  let compassModalInputsMock: CompassManageListModalInputs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        CompassActionButtonComponent,
        CompassAlertModalComponent,
        CompassDropdownDirective,
        CompassManageListModalComponent,
        CompassUserSearchComponent
      ],
      providers: [
        {
          provide: COMPASS_MANAGE_LIST_MODAL_INPUTS,
          userValue: compassModalInputsMock
        }, {
          provide: CompassModalService,
          useValue: compassModalServiceMock
        }, {
          provide: 'searchService',
          useValue: searchServiceMock
        }, {
          provide: CompassDropdownService,
          useValue: compassDropdownServiceMock
        }
      ]
    });

    compassModalInputsMock = {
      title: chance.string(),
      acceptLabel: chance.string(),
      rejectLabel: chance.string(),
      listObject: getListsSummaryMock(),
      currentUser: {
        firstName: chance.string(),
        lastName: chance.string(),
        employeeId: chance.string()
      }
    };

    fixture = TestBed.createComponent(CompassManageListModalComponent);
    componentInstance = fixture.componentInstance;

    componentInstance.modalInputs = compassModalInputsMock;

    fixture.detectChanges();
  });

  describe('Compass Manage List Modal Inputs', () => {
    it('should contain a title element when the injection has a title', () => {
      const titleElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-title'));

      expect(titleElement.nativeElement.textContent).toEqual(compassModalInputsMock.title);

      componentInstance.modalInputs.title = undefined;
      fixture.detectChanges();

      expect(titleElement.nativeElement.textContent).toEqual('');
    });

    it('should contain a cancel button element containing the reject label text', () => {
      const buttonElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-btn'));

      expect(buttonElement.nativeElement.textContent).toEqual(compassModalInputsMock.rejectLabel);
    });

    it('should contain an accept button element containing the accept label text', () => {
      const buttonElement: DebugElement = fixture.debugElement.query(By.css('compass-action-button'));

      expect(buttonElement.nativeElement.textContent).toEqual(compassModalInputsMock.acceptLabel);
    });
  });

  describe('Compass Manage List Modal Outputs', () => {
    it('should output an CompassManageListModalOutput object when the save button is clicked', (done) => {
      const buttonElement: DebugElement = fixture.debugElement.query(By.css('compass-action-button'));
      const expectedOutputObject: CompassManageListModalOutput = {
        listSummary: compassModalInputsMock.listObject,
        type: CompassManageListModalEvent.Save,
        selectedEmployeeId: ''
      };

      componentInstance.buttonContainerEvent.subscribe((value: CompassManageListModalOutput) => {
        expect(value).toEqual(expectedOutputObject);
        done();
      });

      buttonElement.nativeElement.click();
    });
  });

  describe('visible input fields on the manage modal based on list ownership', () => {
    describe('when the current user is also the owner of the list', () => {

      beforeEach(() => {
        componentInstance.modalInputs.currentUser.employeeId = componentInstance.modalInputs.listObject.ownerId;
        componentInstance.ngOnInit();
        fixture.detectChanges();
      });

      it('should contain an input field to change the name of the list', () => {
        const nameInputElement: DebugElement = fixture.debugElement.query(By.css('.modal-input-name'));

        expect(nameInputElement).not.toBe(null);
      });

      it('should contain an input field to change the description of the list', () => {
        const descriptionInputElement: DebugElement = fixture.debugElement.query(By.css('.modal-input-description'));

        expect(descriptionInputElement).not.toBe(null);
      });

      it('should contain an owner footer and not a collaborator footer', () => {
        const ownerFooterElement: DebugElement = fixture.debugElement.query(By.css('.owner-footer'));
        const collaboratorFooterElement: DebugElement = fixture.debugElement.query(By.css('.collaborator-footer'));

        expect(ownerFooterElement).not.toBe(null);
        expect(collaboratorFooterElement).toBe(null);
      });
    });

    describe('when the current user is not the owner of the list', () => {
      it('should not contain an input field to change the name of the list', () => {
        const nameInputElement: DebugElement = fixture.debugElement.query(By.css('.modal-input-name'));

        expect(nameInputElement).toBe(null);
      });

      it('should not contain an input field to change the description of the list', () => {
        const descriptionInputElement: DebugElement = fixture.debugElement.query(By.css('.modal-input-description'));

        expect(descriptionInputElement).toBe(null);
      });

      it('should contain a collaborator footer and not a owner footer', () => {
        const ownerFooterElement: DebugElement = fixture.debugElement.query(By.css('.owner-footer'));
        const collaboratorFooterElement: DebugElement = fixture.debugElement.query(By.css('.collaborator-footer'));

        expect(ownerFooterElement).toBe(null);
        expect(collaboratorFooterElement).not.toBe(null);
      });
    });
  });
});
