import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DismissibleXComponent } from './dismissible-x.component';

describe('DismissibleXComponent', () => {

  let fixture: ComponentFixture<DismissibleXComponent>;
  let componentInstance: DismissibleXComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DismissibleXComponent ]
    });

    fixture = TestBed.createComponent(DismissibleXComponent);
    componentInstance = fixture.componentInstance;
  });

  it('has a hoverX property that is false by default', () => {
    expect(componentInstance.hoverX).toBe(false);
  });

  it('displays the standard X when hoverX is false', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('img').className).toBe('dismissible-row-X');
  });

  it('displays the hover X when hoverX is true', () => {
    componentInstance.hoverX = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('img').className).toBe('dismissible-row-X dismissible-X-hover');
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
