import { TestBed, inject } from '@angular/core/testing';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { dateRangeMock } from '../../models/date-range.model.mock';
import { DateRangesEffects } from './date-ranges.effect';
import { DateRange } from '../../models/date-range.model';
import { DateRangeDTO } from '../../models/date-range-dto.model';
import { dateRangeDTOMock } from '../../models/date-range-dto.model.mock';
import { DateRangeApiService } from '../../services/date-range-api.service';
import { DateRangeTransformerService } from '../../services/date-range-transformer.service';
import { FetchDateRangesAction, FetchDateRangesFailureAction, FetchDateRangesSuccessAction } from '../actions/date-ranges.action';
import { Observable } from 'rxjs';
import * as Chance from 'chance';
let chance = new Chance();

describe('Date Ranges Effects', () => {
  const dateRange1: DateRange = dateRangeMock();
  const dateRange2: DateRange = dateRangeMock();
  const mockDateRanges: DateRange[] = [dateRange1, dateRange2];
  const dateRangeDTO1: DateRangeDTO = dateRangeDTOMock();
  const dateRangeDTO2: DateRangeDTO = dateRangeDTOMock();
  const mockDateRangeDTOs: DateRangeDTO[] = [dateRangeDTO1, dateRangeDTO2];
  const err = new Error(chance.string());

  let runner: EffectsRunner;
  let dateRangesEffects: DateRangesEffects;
  let mockDateRangeApiService = {
    getDateRanges() {
      return Observable.of(mockDateRangeDTOs);
    }
  };
  let mockDateRangeTransformerService = {
    transformDateRanges(dateRangeDTOs: DateRangeDTO[]): DateRange[] {
      return mockDateRanges;
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      DateRangesEffects,
      {
        provide: DateRangeApiService,
        useValue: mockDateRangeApiService
      },
      {
        provide: DateRangeTransformerService,
        useValue: mockDateRangeTransformerService
      }
    ]
  }));

  beforeEach(inject([ EffectsRunner, DateRangesEffects ],
    (_runner: EffectsRunner, _compassWebEffects: DateRangesEffects) => {
      runner = _runner;
      dateRangesEffects = _compassWebEffects;
    }
  ));

  describe('when a FetchDateRangesAction is received', () => {

    describe('when DateRangeApiService returns successfully', () => {

      let dateRangeApiService: DateRangeApiService;
      beforeEach(inject([ DateRangeApiService ],
        (_dateRangeApiService: DateRangeApiService) => {
          dateRangeApiService = _dateRangeApiService;

          runner.queue(new FetchDateRangesAction());
        }
      ));

      it('should return a FetchDateRangesSuccessAction', (done) => {
        dateRangesEffects.fetchDateRanges$().subscribe(result => {
          expect(result).toEqual(new FetchDateRangesSuccessAction(mockDateRanges));
          done();
        });
      });
    });

    describe('when dateRangeApiService returns an error', () => {
      let dateRangeApiService: DateRangeApiService;

      beforeEach(inject([ DateRangeApiService ],
        (_dateRangeApiService: DateRangeApiService) => {
          dateRangeApiService = _dateRangeApiService;
          runner.queue(new FetchDateRangesAction());
        }
      ));

      it('should return a FetchVersionFailureAction after catching an error', (done) => {
        spyOn(dateRangeApiService, 'getDateRanges').and.callFake(() => Observable.of(err));
        dateRangesEffects.fetchDateRanges$().subscribe(() => { done(); }, error => {
          expect(error).toEqual(new FetchDateRangesFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchVersionFailureAction is received', () => {

    beforeEach(() => {
      runner.queue(new FetchDateRangesFailureAction(err));
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
