import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CompassTooltipPopupComponent } from './compass-tooltip-popup.component';
import { CompassTooltipPopupInputs } from '../../../models/compass-tooltip-popup-inputs.model';
import { COMPASS_TOOLTIP_POPUP_INPUTS } from './compass-tooltip-popup.token';

const chance = new Chance();

describe('Compass Tooltip Popup Component', () => {
  let fixture: ComponentFixture<CompassTooltipPopupComponent>;
  let componentInstance: CompassTooltipPopupComponent;

  let compassTooltipPopupInputsMock: CompassTooltipPopupInputs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      declarations: [ CompassTooltipPopupComponent ],
      providers: [{
        provide: COMPASS_TOOLTIP_POPUP_INPUTS,
        useValue: compassTooltipPopupInputsMock
      }]
    });

    fixture = TestBed.createComponent(CompassTooltipPopupComponent);
    componentInstance = fixture.componentInstance;

    compassTooltipPopupInputsMock = {
      title: chance.string(),
      text: [chance.string(), chance.string()],
      markupString: chance.string()
    };

    componentInstance.tooltipInputs = compassTooltipPopupInputsMock;

    fixture.detectChanges();
  });

  describe('Tooltip Popup Inputs', () => {
    it('should contain a title element when the injected tooltipInputs contains a title', () => {
      let titleElement: DebugElement = fixture.debugElement.query(By.css('.compass-tooltip-popup-title'));

      expect(titleElement).not.toBe(null);
      expect(titleElement.nativeElement.textContent).toBe(compassTooltipPopupInputsMock.title);

      componentInstance.tooltipInputs.title = undefined;
      fixture.detectChanges();
      titleElement = fixture.debugElement.query(By.css('.compass-tooltip-popup-title'));

      expect(titleElement).toBe(null);
    });

    it('should contain a text element for every string in the injected tooltipInputs text array', () => {
      let textElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.compass-tooltip-popup-text'));

      expect(textElements.length).toBe(compassTooltipPopupInputsMock.text.length);

      textElements.forEach((textElement: DebugElement, index: number) => {
        expect(textElement.nativeElement.textContent).toBe(compassTooltipPopupInputsMock.text[index]);
      });

      componentInstance.tooltipInputs.text = undefined;
      fixture.detectChanges();
      textElements = fixture.debugElement.queryAll(By.css('.compass-tooltip-popup-text'));

      expect(textElements.length).toBe(0);
    });

    it('should contain a compass-tooltip-markup-content element when the injected tooltipInputs contains a markupString', () => {
      let markupStringContainer: DebugElement = fixture.debugElement.query(By.css('.compass-tooltip-markup-content'));

      expect(markupStringContainer).not.toBe(null);
      expect(markupStringContainer.nativeElement.textContent).toBe(compassTooltipPopupInputsMock.markupString);

      componentInstance.tooltipInputs.markupString = undefined;
      fixture.detectChanges();
      markupStringContainer = fixture.debugElement.query(By.css('.compass-tooltip-markup-content'));

      expect(markupStringContainer).toBe(null);
    });
  });
});
