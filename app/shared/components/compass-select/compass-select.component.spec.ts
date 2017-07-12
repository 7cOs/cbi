import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CompassSelectComponent } from './compass-select.component';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';
import * as Chance from 'chance';

const chance = new Chance();
const keysMock: Array<string> = [];
const optionsMock: Array<any> = [];

for (let i = 0; i < 5; i++) {
  keysMock.push(chance.string());
}

for (let i = 0; i < 5; i++) {
  const mockOption = {};

  keysMock.forEach(randomKey => {
    mockOption[randomKey] = chance.string();
    optionsMock.push(mockOption);
  });
}

const displayKeyMock = keysMock[Math.floor(Math.random() * keysMock.length)];
const valueKeyMock = keysMock[Math.floor(Math.random() * keysMock.length)];
const subDisplayKeyMock = keysMock[Math.floor(Math.random() * keysMock.length)];
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

    componentInstance.options = optionsMock;
    componentInstance.displayKey = displayKeyMock;
    componentInstance.valueKey = valueKeyMock;
    componentInstance.model = optionsMock[0][valueKeyMock];
  });

  describe('component init', () => {
    it('should initialize the current selected option based on the passed in [model] input', fakeAsync(() => {
      fixture.autoDetectChanges(true);
      tick();

      const selectedOptionElement = fixture.debugElement.query(By.css('.mat-select-value-text')).nativeElement;
      expect(selectedOptionElement.textContent).toBe(optionsMock[0][displayKeyMock]);
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
      componentInstance.title = undefined;
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.title'));

      expect(titleElement).toBe(null);
    });
  });

  describe('component subtitle', () => {
    it('should contain a subtitle element when [subDisplayKey] input is passed in', () => {
      componentInstance.subDisplayKey = subDisplayKeyMock;
      componentInstance.options = optionsMock; // Trigger change detection on options input
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(By.css('.subtitle'));

      expect(subtitleElement).not.toBe(null);
      expect(subtitleElement.nativeElement.textContent).toBe(optionsMock[0][subDisplayKeyMock]);
    });

    it('should not contain a sub-title element when [subDisplayKey] input is not passed in', () => {
      componentInstance.subDisplayKey = undefined;
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(By.css('.subtitle'));

      expect(subtitleElement).toBe(null);
    });
  });

  describe('component output event', () => {
    it('should output the value of a clicked option', () => {
      fixture.detectChanges();

      componentInstance.onOptionSelected.subscribe((value: any) => {
        expect(value).toBe(optionsMock[0][valueKeyMock]);
      });

      fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement.click();
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.compass-select-option:nth-child(1)')).triggerEventHandler('click', null);
    });
  });
});
