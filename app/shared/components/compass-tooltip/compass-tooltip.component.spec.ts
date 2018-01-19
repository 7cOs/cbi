import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompassTooltipComponent } from './compass-tooltip.component';

describe('CompassTooltipComponent', () => {

  let fixture: ComponentFixture<CompassTooltipComponent>;
  let componentInstance: CompassTooltipComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassTooltipComponent ]
    });

    fixture = TestBed.createComponent(CompassTooltipComponent);
    componentInstance = fixture.componentInstance;
  });

  it('should display tooltip without title', () => {
    componentInstance.description = 'The day is clear';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('tooltip').className).toBe('compass-tooltip');
  });

  it('should display tooltip with title', () => {
    componentInstance.description = 'The day is clear';
    componentInstance.title = 'Day';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('tooltip').className).toBe('compass-tooltip');
  });
});
