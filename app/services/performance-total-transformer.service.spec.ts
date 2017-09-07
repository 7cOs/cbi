import { inject, TestBed } from '@angular/core/testing';

import { getEntitiesTotalPerformancesDTOMock } from '../models/entities-total-performances.model.mock';
import { getResponsibilityEntitiesPerformanceDTOMock } from '../models/entities-performances.model.mock';
import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { PerformanceTotalTransformerService } from './performance-total-transformer.service';
import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { UtilService } from './util.service';

describe('Service: PerformanceTotalTransformerService', () => {
  let performanceTotalTransformerService: PerformanceTotalTransformerService;
  let utilService: UtilService;
  let entitiesTotalPerformancesDTOMock: EntitiesTotalPerformancesDTO;
  let responsibilityEntitiesPerformanceDTOMock: EntitiesPerformancesDTO[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PerformanceTotalTransformerService, UtilService ]
    });
  });

  describe('transformEntitiesTotalPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTotalTransformerService, UtilService ],
      (_performanceTotalTransformerService: PerformanceTotalTransformerService, _utilService: UtilService) => {
        performanceTotalTransformerService = _performanceTotalTransformerService;
        utilService = _utilService;
        entitiesTotalPerformancesDTOMock = getEntitiesTotalPerformancesDTOMock();
    }));

    it('should return transformed PerformanceTotal data given EntitiesTotalPerformancesDTO data', () => {
      spyOn(performanceTotalTransformerService, 'transformEntitiesTotalPerformancesDTO').and.callThrough();

      const performanceTotal: EntitiesTotalPerformances
        = performanceTotalTransformerService.transformEntitiesTotalPerformancesDTO(entitiesTotalPerformancesDTOMock);

      expect(performanceTotal).toBeDefined();
      expect(performanceTotal).toEqual({
        total: entitiesTotalPerformancesDTOMock.total,
        totalYearAgo: entitiesTotalPerformancesDTOMock.totalYearAgo,
        totalYearAgoPercent: utilService.getYearAgoPercent(entitiesTotalPerformancesDTOMock.total,
          entitiesTotalPerformancesDTOMock.totalYearAgo),
        contributionToVolume: 0
      });
    });
  });

  describe('transformEntityEntitiesTotalPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTotalTransformerService, UtilService ],
      (_performanceTotalTransformerService: PerformanceTotalTransformerService, _utilService: UtilService) => {
        performanceTotalTransformerService = _performanceTotalTransformerService;
        utilService = _utilService;
        responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
    }));

    it('should return transformed EntityPerformanceTotal data given EntityEntitiesTotalPerformancesDTO data', () => {
      spyOn(performanceTotalTransformerService, 'transformEntityEntitiesTotalPerformancesDTO').and.callThrough();

      const entityPerformance: EntitiesPerformances[] =
        performanceTotalTransformerService.transformEntityEntitiesTotalPerformancesDTO(responsibilityEntitiesPerformanceDTOMock);
      const entityPerformanceMock = responsibilityEntitiesPerformanceDTOMock[0].performanceTotal;

      expect(entityPerformance).toBeDefined();
      expect(entityPerformance.length).toBeTruthy();
      expect(entityPerformance[0]).toEqual({
        positionId: responsibilityEntitiesPerformanceDTOMock[0].id,
        name: responsibilityEntitiesPerformanceDTOMock[0].name,
        performanceTotal: {
          total: entityPerformanceMock.total,
          totalYearAgo: entityPerformanceMock.totalYearAgo,
          totalYearAgoPercent: utilService.getYearAgoPercent(entityPerformanceMock.total, entityPerformanceMock.totalYearAgo),
          contributionToVolume: 0
        }
      });
    });
  });
});
