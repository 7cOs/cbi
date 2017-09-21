import { inject, TestBed } from '@angular/core/testing';

import { getEntitiesTotalPerformancesDTOMock } from '../models/entities-total-performances.model.mock';
import { getResponsibilityEntitiesPerformanceDTOMock } from '../models/entities-performances.model.mock';
import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { getEntityPropertyResponsibilitiesMock } from '../models/entity-responsibilities.model.mock';
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
      spyOn(performanceTransformerService, 'transformEntitiesPerformancesDTOs').and.callThrough();

      const entityPerformance: EntitiesPerformances[] =
        performanceTransformerService.transformEntitiesPerformancesDTOs(responsibilityEntitiesPerformanceDTOMock);
      const entityPerformanceMock = responsibilityEntitiesPerformanceDTOMock[0].performanceTotal;

      expect(entityPerformance).toBeDefined();
      expect(entityPerformance.length).toBeTruthy();
      expect(entityPerformance[0]).toEqual({
        positionId: responsibilityEntitiesPerformanceDTOMock[0].id,
        name: responsibilityEntitiesPerformanceDTOMock[0].name,
        performanceTotal: {
          total: parseInt((entityPerformanceMock.total).toFixed(), 10),
          totalYearAgo: utilService.getYearAgoDelta(entityPerformanceMock.total, entityPerformanceMock.totalYearAgo),
          totalYearAgoPercent: utilService.getYearAgoPercent(entityPerformanceMock.total, entityPerformanceMock.totalYearAgo),
          contributionToVolume: 0
        }
      });
    });
  });

  describe('transformEntityDTOWithPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, UtilService ],
      (_performanceTransformerService: PerformanceTransformerService, _utilService: UtilService) => {
        performanceTransformerService = _performanceTransformerService;
        utilService = _utilService;
    }));

    it('should transform data given an entity and performance data', () => {
      const transformPerformanceSpy = spyOn(performanceTransformerService, 'transformEntitiesTotalPerformancesDTO').and.callThrough();

      const entity = getEntityPropertyResponsibilitiesMock();
      const performanceDTO = getEntitiesTotalPerformancesDTOMock();

      const actual = performanceTransformerService.transformEntityDTOWithPerformance(performanceDTO, entity);

      expect(actual.positionId).toBe(entity.positionId);
      expect(actual.name).toBe(entity.name);
      expect(actual.performanceTotal).toBeDefined();
      expect(transformPerformanceSpy).toHaveBeenCalledTimes(1);
      expect(transformPerformanceSpy).toHaveBeenCalledWith(performanceDTO);
    });
  });

  describe('transformEntityWithPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, UtilService ],
      (_performanceTransformerService: PerformanceTransformerService, _utilService: UtilService) => {
        performanceTransformerService = _performanceTransformerService;
        utilService = _utilService;
    }));

    it('should transform data given an entity and performance data', () => {
      const numberOfEntities = chance.natural({min: 1, max: 99});
      const entities = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      const performanceDTOs = Array(numberOfEntities)
        .fill('')
        .map((el, idx) => {
          return Object.assign({}, getEntitiesTotalPerformancesDTOMock(), {entityId: entities[idx].positionId});
        });
      const transformPerformanceEntitySpy = spyOn(performanceTransformerService, 'transformEntityDTOWithPerformance').and.callThrough();

      performanceTransformerService.transformEntityDTOsWithPerformance(performanceDTOs, entities);

      expect(transformPerformanceEntitySpy).toHaveBeenCalledTimes(numberOfEntities);
    });
  });
});
