import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, ElementRef } from '@angular/core';

import { CompassOverlayConfig } from '../../../models/compass-overlay-config.model';
import { CompassOverlayPositionConfig } from '../../../models/compass-overlay-position-config.model';
import { CompassTooltipComponent } from './compass-tooltip.component';
import { CompassTooltipPopupInputs } from '../../../models/compass-tooltip-popup-inputs.model';
import { CompassTooltipService } from '../../../services/compass-tooltip.service';

const chance = new Chance();

describe('Compass Tooltip Component', () => {
  let fixture: ComponentFixture<CompassTooltipComponent>;
  let componentInstance: CompassTooltipComponent;
  let fixtureDebugElement: DebugElement;
  let fixtureElementRef: ElementRef;

  let titleInputMock: string;
  let textInputMock: string[];
  let markupStringInputMock: string;

  const compassTooltipPopupOverlayMock = {
    closeTooltip: jasmine.createSpy('closeTooltip')
  };

  const compassTooltipServiceMock = {
    showTooltip: jasmine.createSpy('showTooltip').and.callFake(() => compassTooltipPopupOverlayMock)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassTooltipComponent ],
      providers: [{
        provide: CompassTooltipService,
        useValue: compassTooltipServiceMock
      }]
    });

    fixture = TestBed.createComponent(CompassTooltipComponent);
    componentInstance = fixture.componentInstance;
    fixtureDebugElement = fixture.debugElement;
    fixtureElementRef = fixture.elementRef;

    titleInputMock = chance.string();
    textInputMock = [chance.string(), chance.string()];
    markupStringInputMock = chance.string();

    componentInstance.title = titleInputMock;
    componentInstance.text = textInputMock;
    componentInstance.markupString = markupStringInputMock;

    fixture.detectChanges();

    compassTooltipServiceMock.showTooltip.calls.reset();
    compassTooltipPopupOverlayMock.closeTooltip.calls.reset();
  });

  describe('Compass Tooltip Mouse Events', () => {
    it('should reach out to the CompassTooltipService and call showTooltip with its own element reference and a CompassTooltipInputs'
      + ' object containing all the inputs on mouse enter events', () => {
      const expectedTooltipInputs: CompassTooltipPopupInputs = {
        title: titleInputMock,
        text: textInputMock,
        markupString: markupStringInputMock
      };
      const expectedPositionConfig: CompassOverlayPositionConfig = {
        originConnectionPosition: { originX: 'center', originY: 'bottom' },
        overlayConnectionPosition: { overlayX: 'center', overlayY: 'top' },
        overlayOffsetX: 0,
        overlayOffsetY: 5
      };
      const expectedOverlayConfig: CompassOverlayConfig = {
        hasBackdrop: false
      };

      fixtureDebugElement.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();

      expect(compassTooltipServiceMock.showTooltip).toHaveBeenCalledWith(
        fixtureElementRef,
        expectedTooltipInputs,
        expectedPositionConfig,
        expectedOverlayConfig
      );
    });

    it('should call closeTooltip on a mouse leave event only after a mouse enter event has happened previously', () => {
      fixtureDebugElement.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();

      expect(compassTooltipPopupOverlayMock.closeTooltip).not.toHaveBeenCalled();

      fixtureDebugElement.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();

      expect(compassTooltipPopupOverlayMock.closeTooltip).not.toHaveBeenCalled();

      compassTooltipPopupOverlayMock.closeTooltip.calls.reset();
      fixtureDebugElement.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();

      expect(compassTooltipPopupOverlayMock.closeTooltip).toHaveBeenCalled();
    });
  });
});
