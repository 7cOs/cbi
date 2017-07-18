import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortableComponent } from './sortable.component';
import { SortStatus } from '../../../enums/sort-status.enum';

describe('GreetingComponent', () => {

  let fixture: ComponentFixture<SortableComponent>;
  let componentInstance: SortableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SortableComponent ]
    });

    fixture = TestBed.createComponent(SortableComponent);
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
