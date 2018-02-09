import * as Chance from 'chance';
import { getTestBed, TestBed } from '@angular/core/testing';

import { DateRange } from '../models/date-range.model';
import { DateRangeDTO } from '../models/date-range-dto.model';
import { DateRangeTransformerService } from './date-range-transformer.service';
import { dateRangeCollectionMock } from '../models/date-range-collection.model.mock';
import { dateRangeDTOsMock } from '../models/date-range-dto-collection.model.mock';
import { getDateRangeDTOMock } from '../models/date-range-dto.model.mock';

const chance = new Chance();

describe('Service: DateRangeTransformerService', () => {
  let testBed: TestBed;
  let dateRangeTransformerService: DateRangeTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ DateRangeTransformerService ]
    });

    testBed = getTestBed();
    dateRangeTransformerService = testBed.get(DateRangeTransformerService);
  });

  describe('transformDateRanges', () => {
    let dateRangeDTOCollectionMock: DateRangeDTO[];
    let extendedNameQuarterMock: string = chance.string();
    let extendedNameYearMock: number = chance.natural();
    let expectedQuarterDateLabel: string;

    beforeEach(() => {
      dateRangeDTOCollectionMock = [getDateRangeDTOMock(), getDateRangeDTOMock()];
      extendedNameQuarterMock = chance.string();
      extendedNameYearMock = chance.natural();
      expectedQuarterDateLabel = `(${ extendedNameQuarterMock }'${extendedNameYearMock})`;
    });

    it('should return a collection of formatted DateRanges from a collection of DateRangeDTOs', () => {
      spyOn(dateRangeTransformerService, 'transformDateRanges').and.callThrough();
      const transformedDateRanges = dateRangeTransformerService.transformDateRanges(dateRangeDTOsMock);
      expect(transformedDateRanges).toEqual(dateRangeCollectionMock);
    });

    it('should return a DateRange with a formatted quarterDateLabel when a DateRangeDTO contains an extendedName', () => {
      dateRangeDTOCollectionMock[0].extendedName = `${ extendedNameQuarterMock } ${ extendedNameYearMock }`;
      const transformedDateRanges: DateRange[] = dateRangeTransformerService.transformDateRanges(dateRangeDTOCollectionMock);

      expect(transformedDateRanges[0].quarterDateLabel).toBeDefined();
      expect(transformedDateRanges[0].quarterDateLabel).toBe(expectedQuarterDateLabel);
      expect(transformedDateRanges[1].quarterDateLabel).not.toBeDefined();
    });

    it('should return a DateRange that contains a concatenated displayCode and quarterDateLabel for the displayCodeQuarterDate when the'
    + ' DateRangeDTO contains an extendedName', () => {
      dateRangeDTOCollectionMock[0].extendedName = `${ extendedNameQuarterMock } ${ extendedNameYearMock }`;
      const transformedDateRanges: DateRange[] = dateRangeTransformerService.transformDateRanges(dateRangeDTOCollectionMock);

      expect(transformedDateRanges[0].displayCodeQuarterDate).toBe(
        `${ transformedDateRanges[0].displayCode } ${ expectedQuarterDateLabel }`);
      expect(transformedDateRanges[0].displayCodeQuarterDate).toBeDefined(transformedDateRanges[0].displayCode);
    });

    it('should contain a displayCodeQuarterDate that is the same as the displayCode when a DateRangeDTO does not'
    + ' contain an extendedName', () => {
      const transformedDateRanges: DateRange[] = dateRangeTransformerService.transformDateRanges(dateRangeDTOCollectionMock);

      transformedDateRanges.forEach((dateRange: DateRange) => {
        expect(dateRange.displayCodeQuarterDate).toBe(dateRange.displayCode);
      });
    });
  });
});
