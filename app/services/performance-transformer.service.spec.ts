import { inject, TestBed } from '@angular/core/testing';

import { getEntitiesTotalPerformancesDTOMock } from '../models/entities-total-performances.model.mock';
import { getResponsibilityEntitiesPerformanceDTOMock } from '../models/entities-performances.model.mock';
import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { PerformanceTransformerService } from './performance-transformer.service';
import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { UtilService } from './util.service';

describe('Service: PerformanceTransformerService', () => {
  let performanceTransformerService: PerformanceTransformerService;
  let utilService: UtilService;
  let entitiesTotalPerformancesDTOMock: EntitiesTotalPerformancesDTO;
  let responsibilityEntitiesPerformanceDTOMock: EntitiesPerformancesDTO[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PerformanceTransformerService, UtilService ]
    });
  });

  describe('transformEntitiesTotalPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, UtilService ],
      (_performanceTransformerService: PerformanceTransformerService, _utilService: UtilService) => {
        performanceTransformerService = _performanceTransformerService;
        utilService = _utilService;
        entitiesTotalPerformancesDTOMock = getEntitiesTotalPerformancesDTOMock();
    }));

    it('should return transformed PerformanceTotal data given EntitiesTotalPerformancesDTO data', () => {
      spyOn(performanceTransformerService, 'transformEntitiesTotalPerformancesDTO').and.callThrough();

      const performanceTotal: EntitiesTotalPerformances
        = performanceTransformerService.transformEntitiesTotalPerformancesDTO(entitiesTotalPerformancesDTOMock);

      expect(performanceTotal).toBeDefined();
      expect(performanceTotal).toEqual({
        total: parseInt((entitiesTotalPerformancesDTOMock.total).toFixed(), 10),
        totalYearAgo: utilService.getYearAgoDelta(
          entitiesTotalPerformancesDTOMock.total, entitiesTotalPerformancesDTOMock.totalYearAgo
        ),
        totalYearAgoPercent: utilService.getYearAgoPercent(
          entitiesTotalPerformancesDTOMock.total, entitiesTotalPerformancesDTOMock.totalYearAgo
        ),
        contributionToVolume: 0
      });
    });
  });

  describe('transformEntityEntitiesTotalPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, UtilService ],
      (_performanceTransformerService: PerformanceTransformerService, _utilService: UtilService) => {
        performanceTransformerService = _performanceTransformerService;
        utilService = _utilService;
        responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
    }));

    it('should return transformed EntityPerformanceTotal data given EntityEntitiesTotalPerformancesDTO data', () => {
      spyOn(performanceTransformerService, 'transformEntitiesPerformancesDTO').and.callThrough();

      const entityPerformance: EntitiesPerformances[] =
        performanceTransformerService.transformEntitiesPerformancesDTO(responsibilityEntitiesPerformanceDTOMock);
      const entityPerformanceMock = responsibilityEntitiesPerformanceDTOMock[0].performanceTotal;

      expect(entityPerformance).toBeDefined();
      expect(entityPerformance.length).toBeTruthy();
      expect(entityPerformance[0]).toEqual({
        positionId: responsibilityEntitiesPerformanceDTOMock[0].id,
        name: responsibilityEntitiesPerformanceDTOMock[0].name,
        subName: responsibilityEntitiesPerformanceDTOMock[0].subName,
        performanceTotal: {
          total: parseInt((entityPerformanceMock.total).toFixed(), 10),
          totalYearAgo: utilService.getYearAgoDelta(entityPerformanceMock.total, entityPerformanceMock.totalYearAgo),
          totalYearAgoPercent: utilService.getYearAgoPercent(entityPerformanceMock.total, entityPerformanceMock.totalYearAgo),
          contributionToVolume: 0
        }
      });
    });
  });
});
