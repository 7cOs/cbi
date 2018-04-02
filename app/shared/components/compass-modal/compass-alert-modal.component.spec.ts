import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompassAlertModalComponent } from './compass-alert-modal.component';
import { CompassAlertModalInputs } from '../../../models/compass-alert-modal-inputs.model';
import { COMPASS_ALERT_MODAL_INPUTS } from './compass-alert-modal.tokens';
import { CompassModalOverlayRef } from './compass-modal.overlayref';
import { CompassAlertModalEvent } from '../../../enums/compass-alert-modal-strings.enum';
import { OverlayRef } from '@angular/cdk/overlay';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassAlertModalComponent ],
      providers: [
      {
        provide: COMPASS_ALERT_MODAL_INPUTS,
        userValue: compassModalInputsMock
      }
      ]
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
    componentInstance.modalOverlayRef = CompassModalOverlayRef as any;
    fixtureDebugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  describe('Compass Alert Modal Inputs', () => {
    it('should contain a title element when the injection has a title', () => {
      let titleElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-title'));
      expect(titleElement.nativeElement.textContent).toEqual(compassModalInputsMock.title);

      componentInstance.modalInputs.title = undefined;
      fixture.detectChanges();
      titleElement = fixture.debugElement.query(By.css('.compass-modal-title'));
      expect(titleElement.nativeElement.textContent).toEqual('');
    });
    it('should contain a body element when the injection has a body', () => {
      let bodyElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-body'));
      expect(bodyElement.nativeElement.textContent).toEqual(compassModalInputsMock.body);
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

  describe('Compass Alert Modal Outputs', () => {
    it('should output a cancel event when the cancel button is selected.', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-btn'));

      componentInstance.buttonContainerEvent.subscribe((value: String) => {
        expect(value).toEqual(CompassAlertModalEvent.Decline);
        expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();
      });

      buttonElement.nativeElement.click();
    });
    it('should output an decline message when the x button is clicked.', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.X-modal-btn-container'));

      componentInstance.buttonContainerEvent.subscribe((value: String) => {
        expect(value).toEqual(CompassAlertModalEvent.Close);
        expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();
      });

      buttonElement.nativeElement.click();
    });
    it('should output an accept message when the accept button is clicked', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));
      componentInstance.buttonContainerEvent.subscribe((value: String) => {
        expect(value).toEqual(CompassAlertModalEvent.Accept);
        expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();
      });

      buttonElement.nativeElement.click();
    });
  });
});
