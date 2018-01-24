import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompassTooltipComponent } from './compass-tooltip.component';
import { CompassTooltipObject } from '../../../models/compass-tooltip-component.model';
import { getTooltipMock } from '../../../models/my-performance-table-row.model.mock';

describe('CompassTooltipComponent', () => {

  let fixture: ComponentFixture<CompassTooltipComponent>;
  let componentInstance: CompassTooltipComponent;

  let tooltipMock: CompassTooltipObject;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassTooltipComponent ]
    });

    fixture = TestBed.createComponent(CompassTooltipComponent);
    componentInstance = fixture.componentInstance;

    tooltipMock = getTooltipMock();
  });

  describe('TooltipComponent with title', () => {
    it('should contain tooltip with header title and position = title_below', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.title = tooltipMock.title;
      componentInstance.position = tooltipMock.position;
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_below'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.descriptions.toString());
    });

    it('should select tooltip with header title, position title_above', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.title = tooltipMock.title;
      componentInstance.position = 'above';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_above'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.descriptions);
    });

    it('should select tooltip with header title, position title_right', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.title = tooltipMock.title;
      componentInstance.position = 'right';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_right'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.descriptions);
    });

    it('should select tooltip with header title, position title_left', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.title = tooltipMock.title;
      componentInstance.position = 'left';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_left'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.descriptions);
    });

  });

  describe('TooltipComponent without title', () => {
    it('should select tooltip with no title, position no_title_below', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.position = tooltipMock.position;
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_below'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.descriptions);
    });

    it('should select tooltip without header title, position no_title_above', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.position = 'above';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_above'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.descriptions);
    });

    it('should select tooltip without header title, position no_title_right', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.position = 'right';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_right'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.descriptions);
    });

    it('should select tooltip without header title, position no_title_left', () => {
      componentInstance.descriptions = [tooltipMock.descriptions[0]];
      componentInstance.position = 'left';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_left'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.descriptions);
    });
  });

});
