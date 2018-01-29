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

  it('L60 date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.L60BDL;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.L60BDL.range);
  });

  it('L90 date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.L90BDL;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.L90BDL.range);
  });

  it('L120 date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.L120BDL;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.L120BDL.range);
  });

  it('L120 date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.L3CM;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.L3CM.range);
  });

  it('FYTD date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.FYTDBDL;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.FYTDBDL.range);
  });

  it('CQTD date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.CQTD;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.CQTD.range);
  });

  it('CYTD date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.CYTDBDL;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.CYTDBDL.range);
  });

  it('MTD (CMIPBDL) date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.CMIPBDL;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.CMIPBDL.range);
  });

  it('FYTM date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.FYTM;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.FYTM.range);
  });

  it('CYTM date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.CYTM;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.CYTM.range);
  });

  it('FQTD date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.FQTD;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.FQTD.range);
  });

  it('CCQTD date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.CCQTD;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.CCQTD.range);
  });

  it('LCM (Clo Mth) date-range check', () => {
    componentInstance.dateRange = DateRangeTimePeriod.LCM;
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(dateRangeStateMock.LCM.range);
  });

  it('should not display a date range when date ranges have not been fetched', () => {
    componentInstance.dateRange = DateRangeTimePeriod['FAKE'];
    fixture.detectChanges();
    expect(daterangeElement.textContent).toBe(``);
  });
});
