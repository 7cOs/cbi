import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CompassOverlayConfig } from '../../../models/compass-overlay-config.model';
import { CompassAlertModalComponent } from './compass-alert-modal.component';
import { CompassAlertModalInputs } from '../../../models/compass-alert-modal-inputs.model';
import { CompassModalService } from '../../../services/compass-modal.service';
import { COMPASS_ALERT_MODAL_INPUTS } from './compass-alert-modal.tokens';

const chance = new Chance();

describe('Compass Modal Component', () => {
  let fixture: ComponentFixture<CompassAlertModalComponent>;
  let componentInstance: CompassAlertModalComponent;
  let fixtureDebugElement: DebugElement;
  let compassModalInputsMock: CompassAlertModalInputs;

  let titleInputMock: string;
  let bodyInputMock: string;
  let acceptLabelMock: string;
  let rejectLabelMock: string;

  const compassModalOverlayMock = {
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

    compassModalServiceMock.showAlertModalDialog.calls.reset();
    compassModalOverlayMock.closeModal.calls.reset();
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
