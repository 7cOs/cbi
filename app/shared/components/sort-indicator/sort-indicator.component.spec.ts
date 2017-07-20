import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortIndicatorComponent } from './sort-indicator.component';
import { SortStatus } from '../../../enums/sort-status.enum';

describe('GreetingComponent', () => {

  let fixture: ComponentFixture<SortIndicatorComponent>;
  let componentInstance: SortIndicatorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SortIndicatorComponent ]
    });

    fixture = TestBed.createComponent(SortIndicatorComponent);
    componentInstance = fixture.componentInstance;
  });

  it('should display the inactive sort img when the status is inactive', () => {
    componentInstance.status = SortStatus.inactive;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('img').className).toBe('sort-inactive');
  });

  it('should display the ascending sort img when the status is ascending', () => {
    componentInstance.status = SortStatus.ascending;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('img').className).toBe('sort-ascending');
  });

  it('should display the descending sort img when the status is descending', () => {
    componentInstance.status = SortStatus.descending;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('img').className).toBe('sort-descending');
  });
});
