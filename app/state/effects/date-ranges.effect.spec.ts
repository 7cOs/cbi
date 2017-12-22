import * as Chance from 'chance';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';

import { DateRange } from '../../models/date-range.model';
import { DateRangeApiService } from '../../services/date-range-api.service';
import { DateRangeDTO } from '../../models/date-range-dto.model';
import { DateRangesEffects } from './date-ranges.effect';
import { DateRangeTransformerService } from '../../services/date-range-transformer.service';
import { FetchDateRangesAction, FetchDateRangesFailureAction, FetchDateRangesSuccessAction } from '../actions/date-ranges.action';
import { getDateRangeMock } from '../../models/date-range.model.mock';

let chance = new Chance();

describe('Date Ranges Effects', () => {
  const dateRange1: DateRange = getDateRangeMock();
  const dateRange2: DateRange = getDateRangeMock();
  const dateRangesMock: DateRange[] = [dateRange1, dateRange2];
  const err = new Error(chance.string());

  let actions$: Subject<any>;
  let dateRangesEffects: DateRangesEffects;
  let dateRangeApiServiceMock = {
    getDateRanges() {
      return Observable.of(dateRangesMock);
    }
  };
  let dateRangeTransformerServiceMock = {
    transformDateRanges(dateRangeDTOs: DateRangeDTO[]): DateRange[] {
      return dateRangesMock;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DateRangesEffects,
        provideMockActions(() => actions$),
        {
          provide: DateRangeApiService,
          useValue: dateRangeApiServiceMock
        },
        {
          provide: DateRangeTransformerService,
          useValue: dateRangeTransformerServiceMock
        }
      ]
    });

    actions$ = new ReplaySubject(1);
  });

  beforeEach(inject([ DateRangesEffects ],
    (_compassWebEffects: DateRangesEffects) => {
      dateRangesEffects = _compassWebEffects;
    }
  ));

  describe('when a FetchDateRangesAction is received', () => {

    describe('when DateRangeApiService returns successfully', () => {

      let dateRangeApiService: DateRangeApiService;
      beforeEach(inject([ DateRangeApiService ],
        (_dateRangeApiService: DateRangeApiService) => {
          dateRangeApiService = _dateRangeApiService;

          actions$.next(new FetchDateRangesAction());
        }
      ));

      it('should return a FetchDateRangesSuccessAction', (done) => {
        dateRangesEffects.fetchDateRanges$().subscribe(result => {
          expect(result).toEqual(new FetchDateRangesSuccessAction(dateRangesMock));
          done();
        });
      });
    });

    describe('when dateRangeApiService returns an error', () => {
      let dateRangeApiService: DateRangeApiService;

      beforeEach(inject([ DateRangeApiService ],
        (_dateRangeApiService: DateRangeApiService) => {
          dateRangeApiService = _dateRangeApiService;
          actions$.next(new FetchDateRangesAction());
        }
      ));

      it('should return a FetchVersionFailureAction after catching an error', (done) => {
        spyOn(dateRangeApiService, 'getDateRanges').and.returnValue(Observable.throw(err));
        dateRangesEffects.fetchDateRanges$().subscribe((result) => {
          expect(result).toEqual(new FetchDateRangesFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchVersionFailureAction is received', () => {

    beforeEach(() => {
      actions$.next(new FetchDateRangesFailureAction(err));
      spyOn(console, 'error');
    });

    // console logging isn't important, but it will be important to test real error handling if added later
    it('should log the error payload', (done) => {
      dateRangesEffects.fetchVersionFailure$().subscribe(() => {
        expect(console.error).toHaveBeenCalled();
        done();
      });
    });
  });
});
