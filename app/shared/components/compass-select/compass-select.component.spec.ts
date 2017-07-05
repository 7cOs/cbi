import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompassSelectComponent } from './compass-select.component';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';
import * as Chance from 'chance';

const chance = new Chance();
const optionsMock = [{}, {}, {}];

optionsMock.forEach((mockOption: any) => {
  mockOption[chance.string()] = chance.string();
  mockOption[chance.string()] = chance.string();
  mockOption[chance.string()] = chance.string();
});

const optionsKeys = Object.keys(optionsMock[0]);
const displayKeyMock = optionsKeys[Math.floor(Math.random() * optionsKeys.length)];
const valueKeyMock = optionsKeys[Math.floor(Math.random() * optionsKeys.length)];
const subDisplayKeyMock = optionsKeys[Math.floor(Math.random() * optionsKeys.length)];
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
});
