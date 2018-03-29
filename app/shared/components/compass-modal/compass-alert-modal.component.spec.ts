import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompassOverlayConfig } from '../../../models/compass-overlay-config.model';
import { CompassAlertModalComponent } from './compass-alert-modal.component';
import { CompassAlertModalInputs } from '../../../models/compass-alert-modal-inputs.model';
import { CompassModalService } from '../../../services/compass-modal.service';
import { COMPASS_ALERT_MODAL_INPUTS } from './compass-alert-modal.tokens';

const chance = new Chance();

describe('Compass Alert Modal Component', () => {
  let fixture: ComponentFixture<CompassAlertModalComponent>;
  let componentInstance: CompassAlertModalComponent;
  let fixtureDebugElement: DebugElement;
  let compassModalInputsMock: CompassAlertModalInputs;

  let titleInputMock: string;
  let bodyInputMock: string;
  let acceptLabelMock: string;
  let rejectLabelMock: string;

  const compassModalOverlayMock = {
    modalInstance: componentInstance,
    closeModal: jasmine.createSpy('closeModal')
  };

  const compassModalServiceMock = {
    showAlertModalDialog: jasmine.createSpy('showAlertModalDialog').and.callFake(() => compassModalOverlayMock)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassAlertModalComponent ],
      providers: [{
        provide: CompassModalService,
        useValue: compassModalServiceMock
      },
      {
        provide: COMPASS_ALERT_MODAL_INPUTS,
        userValue: compassModalInputsMock
      }]
    });

    titleInputMock = chance.string();
    bodyInputMock = chance.string();
    acceptLabelMock = chance.string();
    rejectLabelMock = chance.string();

    compassModalInputsMock = {
      title: titleInputMock,
      body: bodyInputMock,
      acceptLabel: acceptLabelMock,
      rejectLabel: rejectLabelMock
    };

    fixture = TestBed.createComponent(CompassAlertModalComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.modalInputs = compassModalInputsMock;
    fixtureDebugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  describe('Compass Alert Modal Inputs', () => {
    it('should contain a title element when the injection has a title', () => {
      let titleElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-title'));

      expect(titleElement).not.toBe(null);
      expect(titleElement.nativeElement.textContent).toBe(compassModalInputsMock.title);

      componentInstance.modalInputs.title = undefined;
      fixture.detectChanges();
      titleElement = fixture.debugElement.query(By.css('.compass-modal-title'));
      expect(titleElement.nativeElement.textContent).toBe('');
    });
  });

  describe('Compass Alert Modal Inputs', () => {
    it('should contain a body element when the injection has a body', () => {
      let bodyElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-body'));

      expect(bodyElement).not.toBe(null);
      expect(bodyElement.nativeElement.textContent).toBe(compassModalInputsMock.body);
    });
  });

  describe('Compass Alert Modal Inputs', () => {
    it('should contain a cancel button element when the injection has a cancel button string', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-btn'));

      expect(buttonElement).not.toBe(null);
      expect(buttonElement.nativeElement.textContent).toBe(compassModalInputsMock.rejectLabel);
    });
  });

  describe('Compass Alert Modal Inputs', () => {
    it('should contain a accept button element when the injection has a accept button string', () => {
      const expectedModalInputs: CompassAlertModalInputs = {
        title: titleInputMock,
        body: bodyInputMock,
        acceptLabel: acceptLabelMock,
        rejectLabel: rejectLabelMock
      };
      const expectedOverlayConfig: CompassOverlayConfig = {
        hasBackdrop: true
      };
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));

      expect(buttonElement).not.toBe(null);
      expect(buttonElement.nativeElement.textContent).toBe(compassModalInputsMock.acceptLabel);

      componentInstance.buttonContainerEvent.subscribe((value: String) => {
        expect(value).toEqual(compassModalInputsMock.acceptLabel);
      });

      compassModalServiceMock.showAlertModalDialog(expectedModalInputs, expectedOverlayConfig);
      buttonElement.nativeElement.click();

      compassModalOverlayMock.closeModal.calls.reset();
    });
  });

  describe('Compass Modal Events', () => {
    it('should reach out to the CompassModalService and call showAlertModalDialog with a particular CompassAlertModalInputs', () => {
      const expectedModalInputs: CompassAlertModalInputs = {
        title: titleInputMock,
        body: bodyInputMock,
        acceptLabel: acceptLabelMock,
        rejectLabel: rejectLabelMock
      };
      const expectedOverlayConfig: CompassOverlayConfig = {
        hasBackdrop: true
      };

      compassModalServiceMock.showAlertModalDialog(expectedModalInputs, expectedOverlayConfig);

      expect(compassModalServiceMock.showAlertModalDialog).toHaveBeenCalledWith(
        expectedModalInputs,
        expectedOverlayConfig
      );
    });
  });
});
