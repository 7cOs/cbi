// tslint:disable:no-unused-variable
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';
import * as Chance from 'chance';

import { CompassSelectComponent } from './compass-select.component';
import {
  selectOptionsMockNumbers,
  selectOptionsMockStandard,
  selectOptionsMockStrings
} from '../../../models/compass-select-options.model.mock';

const chance = new Chance();
const optionsMockNumbers = selectOptionsMockNumbers();
const optionsMockStandard = selectOptionsMockStandard();
const optionsMockStrings = selectOptionsMockStrings();
const titleMock = chance.string();

describe('CompassSelectComponent', () => {
  let fixture: ComponentFixture<CompassSelectComponent>;
  let componentInstance: CompassSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, FormsModule, MdSelectModule ],
      declarations: [ CompassSelectComponent ]
    });

    fixture = TestBed.createComponent(CompassSelectComponent);
    componentInstance = fixture.componentInstance;

    componentInstance.options = optionsMockStandard;
    componentInstance.model = optionsMockStandard[0].value;
  });

  describe('component init', () => {
    it('should initialize the current selected option based on the passed in [model] input', fakeAsync(() => {
      fixture.autoDetectChanges();
      tick();
      let selectedOptionElement = fixture.debugElement.query(By.css('.mat-select-value-text')).nativeElement;

      expect(selectedOptionElement.textContent).toBe(optionsMockStandard[0].display);

      componentInstance.options = optionsMockNumbers;
      componentInstance.model = optionsMockNumbers[1].value;
      fixture.autoDetectChanges();
      tick();
      selectedOptionElement = fixture.debugElement.query(By.css('.mat-select-value-text')).nativeElement;

      expect(selectedOptionElement.textContent).toBe(optionsMockNumbers[1].display);

      componentInstance.options = optionsMockStrings;
      componentInstance.model = optionsMockStrings[2].value;
      fixture.autoDetectChanges();
      tick();
      selectedOptionElement = fixture.debugElement.query(By.css('.mat-select-value-text')).nativeElement;

      expect(selectedOptionElement.textContent).toBe(optionsMockStrings[2].display);
    }));
  });

  describe('component title', () => {
    it('should contain a title element when [title] input is passed in', () => {
      componentInstance.title = titleMock;
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.title'));

      expect(titleElement).not.toBe(null);
      expect(titleElement.nativeElement.textContent).toBe(titleMock);
    });

    it('should not contain a title element when [title] input is not passed in', () => {
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.title'));

      expect(titleElement).toBe(null);
    });
  });

  describe('component subtitle', () => {
    it('should contain a subtitle element when options are given a string value for subDisplay', () => {
      componentInstance.options = optionsMockStrings;
      componentInstance.model = optionsMockStrings[0].value;
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(By.css('.subtitle'));

      expect(subtitleElement).not.toBe(null);
      expect(subtitleElement.nativeElement.textContent).toBe(optionsMockStrings[0].subDisplay);
    });

    it('should not contain a subtitle element when options are not given a string value for subDisplay', () => {
      componentInstance.options = optionsMockStandard;
      componentInstance.model = optionsMockStandard[0].value;
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(By.css('.subtitle'));

      expect(subtitleElement).toBe(null);
    });
  });

  describe('component output event', () => {
    it('should output the value of a clicked option', () => {
      componentInstance.options = optionsMockStandard;
      componentInstance.model = optionsMockStandard[0].value;
      fixture.detectChanges();

      componentInstance.onOptionSelected.subscribe((value: any) => {
        expect(value).toBe(optionsMockStandard[0].value);
      });

      fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement.click();
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.compass-select-option:nth-child(1)')).triggerEventHandler('click', null);
    });
  });
});
