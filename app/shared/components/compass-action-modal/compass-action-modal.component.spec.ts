import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CompassActionModalComponent } from './compass-action-modal.component';
import { CompassActionModalInputs } from '../../../models/compass-action-modal-inputs.model';
import { COMPASS_ACTION_MODAL_INPUTS } from './compass-action-modal.tokens';
import { CompassActionModalEvent } from '../../../enums/compass-action-modal-event.enum';
import { CompassRadioComponent } from '../compass-radio/compass-radio.component';
import { CompassSelectComponent } from '../compass-select/compass-select.component';
import { MatSelectModule, MatRadioModule } from '@angular/material';
import { RadioInputModel } from '../../../models/compass-radio-input.model';
import { DropdownInputModel } from '../../../models/compass-dropdown-input.model';

const chance = new Chance();
const modalOverlayRefMock = {
  closeModal: jasmine.createSpy('closeModal')
};

describe('Compass Action Modal Component', () => {
  let fixture: ComponentFixture<CompassActionModalComponent>;
  let componentInstance: CompassActionModalComponent;
  let fixtureDebugElement: DebugElement;
  let compassModalInputsMock: CompassActionModalInputs;

  let titleInputMock: string;
  let bodyInputMock: string;
  let radioInputModelMock: RadioInputModel;
  let dropdownInputModelMock: DropdownInputModel;
  let acceptLabelMock: string;
  let rejectLabelMock: string;

  const selectOptionsMock = [{
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.string()
  }, {
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.string()
  }, {
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.string()
  }];

  const radioOptionsMock = [
    { display: chance.string(), value: chance.string() },
    { display: chance.string(), value: chance.string() },
    { display: chance.string(), value: chance.string() }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatSelectModule, MatRadioModule, BrowserModule , FormsModule ],
      declarations: [ CompassActionModalComponent, CompassSelectComponent, CompassRadioComponent ],
      providers: [
      {
        provide: COMPASS_ACTION_MODAL_INPUTS,
        userValue: compassModalInputsMock
      }
      ]
    });

    titleInputMock = chance.string();
    bodyInputMock = chance.string();
    acceptLabelMock = chance.string();
    rejectLabelMock = chance.string();
    radioInputModelMock = {
      selected: radioOptionsMock[0].value,
      radioOptions: radioOptionsMock,
      title: chance.string(),
      stacked: chance.bool()
    };
    dropdownInputModelMock = {
      selected: selectOptionsMock[1].value,
      dropdownOptions: selectOptionsMock,
      title: chance.string()
    };

    compassModalInputsMock = {
      title: titleInputMock,
      bodyText: bodyInputMock,
      radioInputModel: radioInputModelMock,
      dropdownInputModel: dropdownInputModelMock,
      acceptLabel: acceptLabelMock,
      rejectLabel: rejectLabelMock
    };

    fixture = TestBed.createComponent(CompassActionModalComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.modalInputs = compassModalInputsMock;
    componentInstance.modalOverlayRef = modalOverlayRefMock as any;
    fixtureDebugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  describe('Compass Action Modal Inputs', () => {
    it('should contain a title element when the injection has a title', () => {
      let titleElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-title'));
      expect(titleElement.nativeElement.textContent).toEqual(compassModalInputsMock.title);

      componentInstance.modalInputs.title = undefined;
      fixture.detectChanges();
      titleElement = fixture.debugElement.query(By.css('.compass-modal-title'));
      expect(titleElement.nativeElement.textContent).toEqual('');
    });
    it('should contain a body element when the injection has a body text', () => {
      let bodyElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-body'));
      expect(bodyElement.nativeElement.textContent).toEqual(compassModalInputsMock.bodyText);
    });
    it('should contain radio buttons group when the injection has a radioInputModel', () => {
      let radioGroup: DebugElement = fixture.debugElement.query(By.css('.compass-radio'));
      expect(radioGroup.nativeElement).toBeDefined();
    });
    it('should contain dropdown when the injection has a dropdownInputModel', () => {
      let dropdownGroup: DebugElement = fixture.debugElement.query(By.css('.compass-dropdown'));
      expect(dropdownGroup.nativeElement).toBeDefined();
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

  describe('Compass Action Modal Outputs', () => {
    it('should output a cancel event when the cancel button is selected.', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.compass-modal-btn'));

      componentInstance.buttonContainerEvent.subscribe((value: String) => {
        expect(value).toEqual(CompassActionModalEvent.Decline);
      });

      buttonElement.nativeElement.click();
      expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();

    });
    it('should output an decline message when the x button is clicked.', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.X-modal-btn-container'));

      componentInstance.buttonContainerEvent.subscribe((value: String) => {
        expect(value).toEqual(CompassActionModalEvent.Close);
      });

      buttonElement.nativeElement.click();
      expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();

    });
    it('should output the object with corresponding selections when the accept button is clicked', () => {
      let buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-action'));

      fixture.detectChanges();
      componentInstance.buttonContainerEvent.subscribe((value: any) => {
        expect(value.radioOptionSelected).toEqual(componentInstance.radioOptionSelected);
        expect(value.dropdownOptionSelected).toEqual(componentInstance.dropdownOptionSelected);
      });

      buttonElement.nativeElement.click();
      expect(componentInstance.modalOverlayRef.closeModal).toHaveBeenCalled();

    });
  });
});
