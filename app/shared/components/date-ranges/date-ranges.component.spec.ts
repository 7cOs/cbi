import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangeComponent } from './date-ranges.component';
import { dateRangeStateMock } from '../../../models/date-range-state.model.mock';
import { DateRangeTimePeriod } from '../../../enums/date-range-time-period.enum';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

describe('DateRangeComponent', () => {

  let fixture: ComponentFixture<DateRangeComponent>;
  let componentInstance: DateRangeComponent;
  let daterangeElement: HTMLElement;

  const storeMock = {
    select: jasmine.createSpy('select').and.returnValue(Observable.of(dateRangeStateMock))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeComponent ],
      providers: [
        DateRangeComponent,
        {
          provide: Store,
          useValue: storeMock
        }
      ]
    });

    fixture = TestBed.createComponent(DateRangeComponent);
    componentInstance = fixture.componentInstance;
    daterangeElement = fixture.debugElement.query(By.css('p')).nativeElement;
  });

  it('L90 date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.L90;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.L90.range);
  });

  it('FYTD date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.FYTD;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.FYTD.range);
  });

  it('should not display a date range when date ranges have not been fetched', () => {
    componentInstance.dateRange = DateRangeTimePeriod['FAKE'];
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(``);
  });
});
