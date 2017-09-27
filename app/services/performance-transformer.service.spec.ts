import { inject, TestBed } from '@angular/core/testing';

import { getPerformanceDTOMock } from '../models/performance.model.mock';
import { getResponsibilityEntitiesPerformanceDTOMock } from '../models/entity-with-performance.model.mock';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { getEntityPropertyResponsibilitiesMock } from '../models/hierarchy-entity.model.mock';
import { PerformanceTransformerService } from './performance-transformer.service';
import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { UtilService } from './util.service';

describe('Service: PerformanceTransformerService', () => {
  let performanceTransformerService: PerformanceTransformerService;
  let utilService: UtilService;
  let entitiesTotalPerformancesDTOMock: PerformanceDTO;
  let responsibilityEntitiesPerformanceDTOMock: EntityWithPerformanceDTO[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PerformanceTransformerService, UtilService ]
    });
  });

  describe('transformPerformanceDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, UtilService ],
      (_performanceTransformerService: PerformanceTransformerService, _utilService: UtilService) => {
        performanceTransformerService = _performanceTransformerService;
        utilService = _utilService;
        entitiesTotalPerformancesDTOMock = getPerformanceDTOMock();
    }));

    it('should return transformed Performance data given PerformanceDTO data', () => {
      spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callThrough();

      const performance: Performance
        = performanceTransformerService.transformPerformanceDTO(entitiesTotalPerformancesDTOMock);

      expect(performance).toBeDefined();
      expect(performance).toEqual({
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

  describe('transformEntityPerformanceDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, UtilService ],
      (_performanceTransformerService: PerformanceTransformerService, _utilService: UtilService) => {
        performanceTransformerService = _performanceTransformerService;
        utilService = _utilService;
        responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
    }));

    it('should return transformed EntityPerformance data given EntityPerformanceDTO data', () => {
      spyOn(performanceTransformerService, 'transformEntityWithPerformanceDTOs').and.callThrough();

      const entityPerformance: EntityWithPerformance[] =
        performanceTransformerService.transformEntityWithPerformanceDTOs(responsibilityEntitiesPerformanceDTOMock);
      const entityPerformanceMock = responsibilityEntitiesPerformanceDTOMock[0].performance;

      expect(entityPerformance).toBeDefined();
      expect(entityPerformance.length).toBeTruthy();
      expect(entityPerformance[0]).toEqual({
        positionId: responsibilityEntitiesPerformanceDTOMock[0].id,
        name: responsibilityEntitiesPerformanceDTOMock[0].name,
        positionDescription: responsibilityEntitiesPerformanceDTOMock[0].positionDescription,
        performance: {
          total: parseInt((entityPerformanceMock.total).toFixed(), 10),
          totalYearAgo: utilService.getYearAgoDelta(entityPerformanceMock.total, entityPerformanceMock.totalYearAgo),
          totalYearAgoPercent: utilService.getYearAgoPercent(entityPerformanceMock.total, entityPerformanceMock.totalYearAgo),
          contributionToVolume: 0
        }
      });
    });
  });

  describe('transformEntityWithPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, UtilService ],
      (_performanceTransformerService: PerformanceTransformerService, _utilService: UtilService) => {
        performanceTransformerService = _performanceTransformerService;
        utilService = _utilService;
    }));

    it('should transform data given an entity and performance data', () => {
      const transformPerformanceSpy = spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callThrough();

      const entity = getEntityPropertyResponsibilitiesMock();
      const performanceDTO = getPerformanceDTOMock();

      const actual = performanceTransformerService.transformEntityWithPerformance(performanceDTO, entity);

      expect(actual.positionId).toBe(entity.positionId);
      expect(actual.name).toBe(entity.name);
      expect(actual.performance).toBeDefined();
      expect(transformPerformanceSpy).toHaveBeenCalledTimes(1);
      expect(transformPerformanceSpy).toHaveBeenCalledWith(performanceDTO);
    });
  });
});
