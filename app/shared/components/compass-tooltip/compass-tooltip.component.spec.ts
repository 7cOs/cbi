import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompassTooltipComponent } from './compass-tooltip.component';

describe('CompassTooltipComponent', () => {

  let fixture: ComponentFixture<CompassTooltipComponent>;
  let componentInstance: CompassTooltipComponent;

  let titleMock: string;
  let descriptionMock: string;
  let positionMock: string;
  let labelMock: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassTooltipComponent ]
    });

    fixture = TestBed.createComponent(CompassTooltipComponent);
    componentInstance = fixture.componentInstance;

    titleMock = chance.string();
    descriptionMock = chance.string();
    positionMock = chance.string();
    labelMock = chance.string();
  });

  describe('TooltipComponent with title', () => {
    it('should contain tooltip with header title and position = title_below', () => {
      componentInstance.description = descriptionMock;
      componentInstance.title = titleMock;
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_below'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.description);
    });

    it('should select tooltip with header title, position title_above', () => {
      componentInstance.description = descriptionMock;
      componentInstance.title = titleMock;
      componentInstance.position = 'above';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_above'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.description);
    });

    it('should select tooltip with header title, position title_right', () => {
      componentInstance.description = descriptionMock;
      componentInstance.title = titleMock;
      componentInstance.position = 'right';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_right'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.description);
    });

    it('should select tooltip with header title, position title_left', () => {
      componentInstance.description = descriptionMock;
      componentInstance.title = titleMock;
      componentInstance.position = 'left';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_with_title'));
      const elementPosition = fixture.debugElement.query(By.css('.title_left'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.title + componentInstance.description);
    });

  });

  describe('TooltipComponent without title', () => {
    it('should select tooltip with no title, position no_title_below', () => {
      componentInstance.description = descriptionMock;
      componentInstance.position = 'below';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_below'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.description);
    });

    it('should select tooltip without header title, position no_title_above', () => {
      componentInstance.description = descriptionMock;
      componentInstance.position = 'above';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_above'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.description);
    });

    it('should select tooltip without header title, position no_title_right', () => {
      componentInstance.description = descriptionMock;
      componentInstance.position = 'right';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_right'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.description);
    });

    it('should select tooltip without header title, position no_title_left', () => {
      componentInstance.description = descriptionMock;
      componentInstance.position = 'left';
      fixture.detectChanges();
      const elementText = fixture.debugElement.query(By.css('.tooltip_text_no_title'));
      const elementPosition = fixture.debugElement.query(By.css('.no_title_left'));
      expect(elementText).not.toBe(null);
      expect(elementPosition).not.toBe(null);
      expect(elementText.nativeElement.textContent).toBe(componentInstance.description);
    });
  });

});
