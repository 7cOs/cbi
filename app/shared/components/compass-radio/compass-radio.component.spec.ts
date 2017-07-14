import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdRadioModule } from '@angular/material';
import * as Chance from 'chance';

import { CompassRadioComponent } from './compass-radio.component';

const chance = new Chance();
const keysMock: Array<string> = [];
const optionsMock: Array<any> = [];

for (let i = 0; i < 3; i++) {
  keysMock.push(chance.string());
}

for (let i = 0; i < 3; i++) {
  const mockOption = {};

  keysMock.forEach(randomKey => {
    mockOption[randomKey] = chance.string();
  });

  optionsMock.push(mockOption);
}

const displayKeyMock = keysMock[Math.floor(Math.random() * keysMock.length)];
const valueKeyMock = keysMock[Math.floor(Math.random() * keysMock.length)];
const titleMock = chance.string();

describe('CompassRadioComponent', () => {
  let fixture: ComponentFixture<CompassRadioComponent>;
  let componentInstance: CompassRadioComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, FormsModule, MdRadioModule ],
      declarations: [ CompassRadioComponent ]
    });

    fixture = TestBed.createComponent(CompassRadioComponent);
    componentInstance = fixture.componentInstance;

    componentInstance.options = optionsMock;
    componentInstance.displayKey = displayKeyMock;
    componentInstance.valueKey = valueKeyMock;
    componentInstance.model = optionsMock[0][valueKeyMock];
  });

  describe('component init', () => {
    it('should initialize the current selected option based on the passed in [model] input', fakeAsync(() => {
      fixture.autoDetectChanges(true);
      tick();
      const selectedRadioButtonElement = fixture.debugElement.query(By.css('.mat-radio-checked .compass-radio-value')).nativeElement;

      expect(selectedRadioButtonElement.textContent).toBe(optionsMock[0][displayKeyMock]);
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

  describe('component output event', () => {
    it('should output the value of a clicked radio button', () => {
      fixture.detectChanges();

      componentInstance.onRadioClicked.subscribe((value: string) => {
        expect(value).toBe(optionsMock[0][valueKeyMock]);
      });

      fixture.debugElement.query(By.css('.compass-radio-button:nth-child(1)')).triggerEventHandler('click', null);
    });
  });

  describe('radio button direction styles', () => {
    it('should have a "inline" class when [direction] input is "inline"', () => {
      componentInstance.direction = 'inline';
      fixture.detectChanges();
      const inlineRadioElement = fixture.debugElement.query(By.css('.compass-radio-group:nth-child(1) .inline'));
      const stackedRadioElement = fixture.debugElement.query(By.css('.compass-radio-group:nth-child(1) .stacked'));

      expect(inlineRadioElement).not.toBe(null);
      expect(stackedRadioElement).toBe(null);
    });

    it('should have a "stacked" class when [direction] input is "stacked"', () => {
      componentInstance.direction = 'stacked';
      fixture.detectChanges();
      const inlineRadioElement = fixture.debugElement.query(By.css('.compass-radio-group:nth-child(1) .inline'));
      const stackedRadioElement = fixture.debugElement.query(By.css('.compass-radio-group:nth-child(1) .stacked'));

      expect(inlineRadioElement).toBe(null);
      expect(stackedRadioElement).not.toBe(null);
    });
  });
});
