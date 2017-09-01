import { inject, TestBed } from '@angular/core/testing';

import { getPerformanceTotalDTOMock } from '../models/performance-total.model.mock';
import { getResponsibilityEntitiesPerformanceDTOMock } from '../models/entity-responsibilities.model.mock';
import { PerformanceTotal, PerformanceTotalDTO } from '../models/performance-total.model';
import { PerformanceTotalTransformerService } from './performance-total-transformer.service';
import { ResponsibilityEntityPerformance, ResponsibilityEntityPerformanceDTO } from '../models/entity-responsibilities.model';
import { UtilService } from './util.service';

describe('Service: PerformanceTotalTransformerService', () => {
  let performanceTotalTransformerService: PerformanceTotalTransformerService;
  let utilService: UtilService;
  let performanceTotalDTOMock: PerformanceTotalDTO;
  let responsibilityEntitiesPerformanceDTOMock: ResponsibilityEntityPerformanceDTO[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PerformanceTotalTransformerService, UtilService ]
    });
  });

  describe('transformPerformanceTotalDTO', () => {

    beforeEach(inject([ PerformanceTotalTransformerService, UtilService ],
      (_performanceTotalTransformerService: PerformanceTotalTransformerService, _utilService: UtilService) => {
        performanceTotalTransformerService = _performanceTotalTransformerService;
        utilService = _utilService;
        performanceTotalDTOMock = getPerformanceTotalDTOMock();
    }));

    it('should return transformed PerformanceTotal data given PerformanceTotalDTO data', () => {
      spyOn(performanceTotalTransformerService, 'transformPerformanceTotalDTO').and.callThrough();

      const performanceTotal: PerformanceTotal = performanceTotalTransformerService.transformPerformanceTotalDTO(performanceTotalDTOMock);

      expect(performanceTotal).toBeDefined();
      expect(performanceTotal).toEqual({
        total: performanceTotalDTOMock.total,
        totalYearAgo: performanceTotalDTOMock.totalYearAgo,
        totalYearAgoPercent: utilService.getYearAgoPercent(performanceTotalDTOMock.total, performanceTotalDTOMock.totalYearAgo),
        contributionToVolume: 0
      });
    });
  });

  describe('transformEntityPerformanceTotalDTO', () => {

    beforeEach(inject([ PerformanceTotalTransformerService, UtilService ],
      (_performanceTotalTransformerService: PerformanceTotalTransformerService, _utilService: UtilService) => {
        performanceTotalTransformerService = _performanceTotalTransformerService;
        utilService = _utilService;
        responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
    }));

    it('should return transformed EntityPerformanceTotal data given EntityPerformanceTotalDTO data', () => {
      spyOn(performanceTotalTransformerService, 'transformEntityPerformanceTotalDTO').and.callThrough();

      const entityPerformance: ResponsibilityEntityPerformance[] =
        performanceTotalTransformerService.transformEntityPerformanceTotalDTO(responsibilityEntitiesPerformanceDTOMock);
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
