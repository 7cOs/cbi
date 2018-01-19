import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompassTooltipComponent } from './compass-tooltip.component';

describe('CompassTooltipComponent', () => {

  let fixture: ComponentFixture<CompassTooltipComponent>;
  let componentInstance: CompassTooltipComponent;

  let titleMock: number;
  let descriptionMock: string;
  let positionMock: string;
  let labelMock: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassTooltipComponent ]
    });

    fixture = TestBed.createComponent(CompassTooltipComponent);
    componentInstance = fixture.componentInstance;

    titleMock = chance.natural();
    descriptionMock = chance.string();
    positionMock = chance.string();
    labelMock = chance.string();
  });

  describe('Component Init', () => {
    it('should display tooltip with title', () => {
      const element = fixture.debugElement.query(By.css('.header-tooltip')).nativeElement;
      fixture.detectChanges();
      expect(element).toBe(descriptionMock);
    });
  });
});
