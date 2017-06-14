import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { DateRangeComponent } from './date-ranges.component';
import { DateRangeService } from '../../../services/date-range.service';
import { DateRange } from '../../../models/date-range.model';
import { getDateRangeMock } from '../../../models/date-range.model.mock';

describe('DateRangeComponent', () => {

  let fixture: ComponentFixture<DateRangeComponent>;
  let componentInstance: DateRangeComponent;
  let daterangeElement: HTMLElement;

  beforeEach(() => {

    const mockDateRange: DateRange = getDateRangeMock();
    let mockDateRangeService = {
      getDateRange() {
        return Observable.of(mockDateRange);
      }
    };

    TestBed.configureTestingModule({
      declarations: [ DateRangeComponent ],
      providers: [
        DateRangeComponent,
        {
          provide: DateRangeService,
          useValue: mockDateRangeService
        }
      ]
    });

    fixture = TestBed.createComponent(DateRangeComponent);
    componentInstance = fixture.componentInstance;
    daterangeElement = fixture.debugElement.query(By.css('p')).nativeElement;

    it('L90 date-range check', () => {
      componentInstance.daterangeinput = 'L90';
      fixture.detectChanges();
      expect(daterangeElement.textContent).toBe(`${mockDateRange.range}`);
    });

    it('FYTD date-range check', () => {
      componentInstance.daterangeinput = 'FYTD';
      fixture.detectChanges();
      expect(daterangeElement.textContent).toBe(`${mockDateRange.range}`);
    });

    it('FAKE date-range check should be NULL', () => {
      componentInstance.daterangeinput = 'FAKE';
      fixture.detectChanges();
      expect(daterangeElement.textContent).toBe(``);
    });
  });
});
