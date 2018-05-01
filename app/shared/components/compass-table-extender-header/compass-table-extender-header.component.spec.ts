import * as Chance from 'chance';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassTableExtenderHeaderComponent } from './compass-table-extender-header.component';
import { CompassTooltipComponent } from '../compass-tooltip/compass-tooltip.component';
import { CompassTooltipPopupInputs } from '../../../models/compass-tooltip-popup-inputs.model';
import { CompassTooltipService } from '../../../services/compass-tooltip.service';
import { NumberPipeMock } from '../../../pipes/number.pipe.mock';

const chance = new Chance();

describe('Team Performance Opportunities Component', () => {
  let fixture: ComponentFixture<CompassTableExtenderHeaderComponent>;
  let componentInstance: CompassTableExtenderHeaderComponent;

  let mainTitleMock: string;
  let subtitleMock: string;
  let tooltipInputsMock: CompassTooltipPopupInputs;

  const compassTooltipServiceMock = {
    showTooltip: jasmine.createSpy('showTooltip')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompassTooltipComponent,
        CompassTableExtenderHeaderComponent,
        NumberPipeMock
      ],
      providers: [{
        provide: CompassTooltipService,
        useValue: compassTooltipServiceMock
      }]
    });

    fixture = TestBed.createComponent(CompassTableExtenderHeaderComponent);
    componentInstance = fixture.componentInstance;

    mainTitleMock = chance.string();
    subtitleMock = chance.string();
    tooltipInputsMock = {
      title: chance.string()
    };

    componentInstance.mainTitle = mainTitleMock;
    componentInstance.subtitle = subtitleMock;

    fixture.detectChanges();
  });

  describe('component init', () => {
    it('should display the passed in mainTitle', () => {
      const mainTitleElement = fixture.debugElement.query(By.css('.header-title')).nativeElement;

      expect(mainTitleElement.textContent).toBe(mainTitleMock);
    });

    it('should display the passed in subtitle', () => {
      const subtitleElement = fixture.debugElement.query(By.css('.header-sub-title')).nativeElement;

      expect(subtitleElement.textContent).toBe(subtitleMock);
    });

    it('should NOT contain a compass-tooltip element if no tooltip inputs are passed in', () => {
      const compassTooltipElement = fixture.debugElement.query(By.css('.header-tooltip'));

      expect(compassTooltipElement).toBeNull();
    });

    it('should contain a compass-tooltip element if a tooltip input is passed in', () => {
      componentInstance.tooltip = tooltipInputsMock;
      fixture.detectChanges();

      const compassTooltipElement = fixture.debugElement.query(By.css('.header-tooltip'));

      expect(compassTooltipElement).not.toBeNull();
    });
  });

  describe('output events', () => {
    it('should emit an event with no value when the `X` element is clicked', (done) => {
      componentInstance.onCloseIndicatorClicked.subscribe((value: any) => {
        expect(value).toBe(undefined);
        done();
      });

      fixture.debugElement.query(By.css('.close-indicator')).nativeElement.click();
    });
  });
});
