import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { dateRangeStateMock } from '../../../models/date-range-state.model.mock';
import { DateRangeTimePeriod } from '../../../enums/date-range-time-period.enum';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

describe('CompassTooltipComponent', () => {

  // let fixture: ComponentFixture<DateRangeComponent>;
  // let componentInstance: DateRangeComponent;
  // let daterangeElement: HTMLElement;

  const storeMock = {
    select: jasmine.createSpy('select').and.returnValue(Observable.of(dateRangeStateMock))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // declarations: [ DateRangeComponent ],
      providers: [
        // DateRangeComponent,
        {
          provide: Store,
          useValue: storeMock
        }
      ]
    });

    // fixture = TestBed.createComponent(DateRangeComponent);
    // componentInstance = fixture.componentInstance;
    // daterangeElement = fixture.debugElement.query(By.css('p')).nativeElement;
  });

  it('L60 date-range check', () => {
    // componentInstance.dateRange = DateRangeTimePeriod.L60BDL;
    // fixture.detectChanges();
    // expect(daterangeElement.textContent).toBe(dateRangeStateMock.L60BDL.range);
  });

  it('L90 date-range check', () => {
    // componentInstance.dateRange = DateRangeTimePeriod.L90BDL;
    // fixture.detectChanges();
    // expect(daterangeElement.textContent).toBe(dateRangeStateMock.L90BDL.range);
  });

  it('L120 date-range check', () => {
    // componentInstance.dateRange = DateRangeTimePeriod.L120BDL;
    // fixture.detectChanges();
    // expect(daterangeElement.textContent).toBe(dateRangeStateMock.L120BDL.range);
  });

  it('L120 date-range check', () => {
    // componentInstance.dateRange = DateRangeTimePeriod.L3CM;
    // fixture.detectChanges();
    // expect(daterangeElement.textContent).toBe(dateRangeStateMock.L3CM.range);
  });
});
