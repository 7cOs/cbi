import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DismissableXComponent } from './dismissable-x.component';

describe('DismissableXComponent', () => {

  let fixture: ComponentFixture<DismissableXComponent>;
  let componentInstance: DismissableXComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DismissableXComponent ]
    });

    fixture = TestBed.createComponent(DismissableXComponent);
    componentInstance = fixture.componentInstance;
  });

  it('has a hoverX property that is false by default', () => {
    expect(componentInstance.hoverX).toBe(false);
  });

  it('displays the standard X when hoverX is false', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('img').className).toBe('dismissable-row-X');
  });

  it('displays the hover X when hoverX is true', () => {
    componentInstance.hoverX = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('img').className).toBe('dismissable-row-X dismissable-X-hover');
  });

  describe('setHoverX', () => {
    it('sets the hoverX property to true', () => {
        expect(componentInstance.hoverX).toBe(false);
        componentInstance.setHoverX();
        fixture.detectChanges();
        expect(componentInstance.hoverX).toBe(true);
    });
  });

  describe('unsetHoverX', () => {
    it('sets the hoverX property to false', () => {
        componentInstance.hoverX = true;
        expect(componentInstance.hoverX).toBe(true);
        componentInstance.setHoverX();
        fixture.detectChanges();
        expect(componentInstance.hoverX).toBe(true);
    });
  });
});
