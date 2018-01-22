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

  it('should display tooltip with no title', () => {
    componentInstance.description = descriptionMock;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('span').className).toBe('tooltip_text_no_title ');
  });

  it('should display tooltip with title', () => {
    componentInstance.description = descriptionMock;
    componentInstance.title = titleMock;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('span').className).toBe('tooltip_text_with_title ');
  });

});
