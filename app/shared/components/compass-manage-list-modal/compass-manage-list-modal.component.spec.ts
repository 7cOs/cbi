import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompassManageListModalComponent } from './compass-manage-list-modal.component';
import { CompassManageListModalInputs } from '../../../models/compass-manage-list-modal-inputs.model';
import { COMPASS_MANAGE_LIST_MODAL_INPUTS } from './compass-manage-list-modal.tokens';
import { CompassModalService } from '../../../services/compass-modal.service';
import { CompassUserSearchComponent } from '../compass-user-search/compass-user-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  let compassModalService: CompassModalService;

  let compassModalInputsMock: CompassManageListModalInputs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        CompassManageListModalComponent,
        CompassUserSearchComponent
      ],
      providers: [
        {
          provide: COMPASS_MANAGE_LIST_MODAL_INPUTS,
          userValue: compassModalInputsMock
        }, {
          provide: CompassModalService,
          useValue: compassModalService
        }, {
          provide: 'searchService',
          useValue: searchServiceMock
        }
      ]
    });

    compassModalInputsMock = {
      title: chance.string(),
      acceptLabel: chance.string(),
      rejectLabel: chance.string(),
      listObject: {
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
      },
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

    it('should contain a cancel button element when the injection has a cancel button string', () => {
      const buttonElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-btn'));

      expect(buttonElement.nativeElement.textContent).toEqual(compassModalInputsMock.rejectLabel);
    });

    it('should contain an accept button element when the injection has an accept button string', () => {
      const buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));

      expect(buttonElement.nativeElement.textContent).toEqual(compassModalInputsMock.acceptLabel);
    });
  });

  describe('Compass Manage List Modal Outputs', () => {
    it('should output an accept message when the accept button is clicked', (done) => {
      const buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));

      componentInstance.buttonContainerEvent.subscribe((value: object) => {
        expect(value).toEqual(compassModalInputsMock.listObject);
        done();
      });

      buttonElement.nativeElement.click();
    });
  });
});
