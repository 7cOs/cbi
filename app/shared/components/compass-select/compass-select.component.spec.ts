import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import * as Chance from 'chance';

import { CompassSelectComponent } from './compass-select.component';
import {
  getSelectOptionsMockNumbers,
  getSelectOptionsMockStandard,
  getSelectOptionsMockStrings
} from '../../../models/compass-select-options.model.mock';

const chance = new Chance();
const optionsMockNumbers = getSelectOptionsMockNumbers();
const optionsMockStandard = getSelectOptionsMockStandard();
const optionsMockStrings = getSelectOptionsMockStrings();
const titleMock = chance.string();

describe('CompassSelectComponent', () => {
  let fixture: ComponentFixture<CompassSelectComponent>;
  let componentInstance: CompassSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, FormsModule, MatSelectModule ],
      declarations: [ CompassSelectComponent ]
    });

    fixture = TestBed.createComponent(CompassSelectComponent);
    componentInstance = fixture.componentInstance;

    componentInstance.options = optionsMockStandard;
    componentInstance.model = optionsMockStandard[0].value;
  });

  describe('component init', () => {
    it('should initialize the currently displayed/selected option based on the passed in [model] input', fakeAsync(() => {
      fixture.autoDetectChanges();
      tick();
      let displayedTriggerElement = fixture.debugElement.query(By.css('mat-select-trigger')).nativeElement;

      expect(displayedTriggerElement.textContent).toBe(optionsMockStandard[0].display);

      componentInstance.options = optionsMockNumbers;
      componentInstance.model = optionsMockNumbers[1].value;
      fixture.autoDetectChanges();
      tick();
      displayedTriggerElement = fixture.debugElement.query(By.css('mat-select-trigger')).nativeElement;

      expect(displayedTriggerElement.textContent).toBe(optionsMockNumbers[1].display);

      componentInstance.options = optionsMockStrings;
      componentInstance.model = optionsMockStrings[2].value;
      fixture.autoDetectChanges();
      tick();
      displayedTriggerElement = fixture.debugElement.query(By.css('mat-select-trigger')).nativeElement;

      expect(displayedTriggerElement.textContent).toBe(optionsMockStrings[2].display);
    }));
  });

  describe('component title', () => {
    it('should contain a title element when [title] input is passed in', () => {
      componentInstance.title = titleMock;
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.select-title'));

      expect(titleElement).not.toBe(null);
      expect(titleElement.nativeElement.textContent).toBe(titleMock);
    });

    it('should not contain a title element when [title] input is not passed in', () => {
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.select-title'));

      expect(titleElement).toBe(null);
    });
  });

  describe('component subtitle', () => {
    it('should contain a subtitle element when options are given a string value for subDisplay', () => {
      componentInstance.options = optionsMockStrings;
      componentInstance.model = optionsMockStrings[0].value;
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(By.css('.select-subtitle'));

      expect(subtitleElement).not.toBe(null);
      expect(subtitleElement.nativeElement.textContent).toBe(optionsMockStrings[0].subDisplay);
    });

    it('should not contain a subtitle element when options are not given a string value for subDisplay', () => {
      componentInstance.options = optionsMockStandard;
      componentInstance.model = optionsMockStandard[0].value;
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(By.css('.select-subtitle'));

      expect(subtitleElement).toBe(null);
    });
  });

  describe('component output event', () => {
    xit('should output the value of a clicked option', (done: any) => {
      componentInstance.options = optionsMockStandard;
      componentInstance.model = optionsMockStandard[0].value;
      fixture.detectChanges();

      componentInstance.onOptionSelected.subscribe((value: any) => {
        expect(value).toBe(optionsMockStandard[0].value);
        done();
      });

      fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement.click();
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.compass-select-option:nth-child(1)')).nativeElement.click();
    });
  });
});
