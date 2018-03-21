import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, ElementRef } from '@angular/core';

import { CompassOverlayConfig } from '../../../models/compass-overlay-config.model';
import { CompassOverlayPositionConfig } from '../../../models/compass-overlay-position-config.model';
import { CompassModalComponent } from './compass-modal.component';
import { CompassModalInputs } from '../../../models/compass-modal-inputs.model';
import { CompassModalService } from '../../../services/compass-modal.service';
import { COMPASS_MODAL_INPUTS } from './compass-modal.tokens';

const chance = new Chance();

describe('Compass Modal Component', () => {
  let fixture: ComponentFixture<CompassModalComponent>;
  let componentInstance: CompassModalComponent;
  let fixtureDebugElement: DebugElement;
  let compassModalInputsMock: CompassModalInputs;

  let titleInputMock: string;
  let bodyInputMock: string;
  let acceptLabelMock: string;
  let rejectLabelMock: string;

  const compassModalOverlayMock = {
    closeModal: jasmine.createSpy('closeModal')
  };

  const compassModalServiceMock = {
    showModalDialog: jasmine.createSpy('showModalDialog').and.callFake(() => compassModalOverlayMock)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassModalComponent ],
      providers: [{
        provide: CompassModalService,
        useValue: compassModalServiceMock
      },
      {
        provide: COMPASS_MODAL_INPUTS,
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

    fixture = TestBed.createComponent(CompassModalComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.modalInputs = compassModalInputsMock;
    fixtureDebugElement = fixture.debugElement;

    fixture.detectChanges();

    compassModalServiceMock.showModalDialog.calls.reset();
    compassModalOverlayMock.closeModal.calls.reset();
  });

  describe('Compass Modal Events', () => {
    it('should reach out to the CompassModalService and call showModalDialog with a particular CompassModalInputs', () => {
      const expectedModalInputs: CompassModalInputs = {
        title: titleInputMock,
        body: bodyInputMock,
        acceptLabel: acceptLabelMock,
        rejectLabel: rejectLabelMock
      };
      const expectedOverlayConfig: CompassOverlayConfig = {
        hasBackdrop: true
      };

      compassModalServiceMock.showModalDialog(expectedModalInputs, expectedOverlayConfig);

      expect(compassModalServiceMock.showModalDialog).toHaveBeenCalledWith(
        expectedModalInputs,
        expectedOverlayConfig
      );
    });
  });
});
