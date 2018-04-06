import { inject, TestBed } from '@angular/core/testing';

import { CalculatorService } from '../calculator.service';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { getEntityPropertyResponsibilitiesMock } from '../../models/hierarchy-entity.model.mock';
import { getPerformanceDTOMock } from '../../models/performance-dto.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { HierarchyGroup } from '../../models/hierarchy-group.model';
import { Performance } from '../../models/performance.model';
import { PerformanceDTO } from '../../models/performance-dto.model';
import { PerformanceTransformerService } from './performance-transformer.service';

describe('Service: PerformanceTransformerService', () => {
  let calculatorService: CalculatorService;
  let performanceTransformerService: PerformanceTransformerService;
  let entitiesTotalPerformancesDTOMock: PerformanceDTO;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ CalculatorService, PerformanceTransformerService ]
    });
  });

  describe('transformPerformanceDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, CalculatorService ],
      (_performanceTransformerService: PerformanceTransformerService, _calculatorService: CalculatorService) => {
        performanceTransformerService = _performanceTransformerService;
        calculatorService = _calculatorService;
        entitiesTotalPerformancesDTOMock = getPerformanceDTOMock();
    }));

    it('should return transformed Performance data given PerformanceDTO data', () => {
      spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callThrough();

      const performance: Performance
        = performanceTransformerService.transformPerformanceDTO(entitiesTotalPerformancesDTOMock);

      expect(performance).toBeDefined();
      expect(performance).toEqual({
        total: parseInt((entitiesTotalPerformancesDTOMock.total).toFixed(), 10),
        totalYearAgo: calculatorService.getYearAgoDelta(
          entitiesTotalPerformancesDTOMock.total, entitiesTotalPerformancesDTOMock.totalYearAgo
        ),
        totalYearAgoPercent: calculatorService.getYearAgoPercent(
          entitiesTotalPerformancesDTOMock.total, entitiesTotalPerformancesDTOMock.totalYearAgo
        ),
        contributionToVolume: 0,
        error: false
      });
    });

    it('should return error Performance data when given null input', () => {
      spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callThrough();

      const performance: Performance
        = performanceTransformerService.transformPerformanceDTO(null);

      expect(performance).toBeDefined();
      expect(performance).toEqual({
        total: 0,
        totalYearAgo: 0,
        totalYearAgoPercent: 0,
        contributionToVolume: 0,
        error: true
      });
    });
  });

  describe('transformEntityWithPerformancesDTO', () => {

    beforeEach(inject([ PerformanceTransformerService, CalculatorService ],
      (_performanceTransformerService: PerformanceTransformerService, _calculatorService: CalculatorService) => {
        performanceTransformerService = _performanceTransformerService;
        calculatorService = _calculatorService;
    }));

    it('should transform data given an entity and performance data', () => {
      const transformPerformanceSpy = spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callThrough();

      const entity = getEntityPropertyResponsibilitiesMock();
      const performanceDTO = getPerformanceDTOMock();

      const actual = performanceTransformerService.transformEntityWithPerformance(performanceDTO, entity);

      expect(actual.positionId).toBe(entity.positionId);
      expect(actual.name).toBe(entity.name);
      expect(actual.entityType).toEqual(entity.entityType);
      expect(actual.performance).toBeDefined();
      expect(transformPerformanceSpy).toHaveBeenCalledTimes(1);
      expect(transformPerformanceSpy).toHaveBeenCalledWith(performanceDTO);
    });

    it('should transform data given an entity and performance data with positionDescription present', () => {
      const transformPerformanceSpy = spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callThrough();

      const entity = getEntityPropertyResponsibilitiesMock();
      const performanceDTO = getPerformanceDTOMock();

      const actual = performanceTransformerService.transformEntityWithPerformance(performanceDTO, entity);

      expect(actual.positionId).toBe(entity.positionId);
      expect(actual.name).toBe(entity.name);
      expect(actual.positionDescription).toBe(entity.positionDescription);
      expect(actual.entityType).toEqual(entity.entityType);
      expect(actual.performance).toBeDefined();
      expect(transformPerformanceSpy).toHaveBeenCalledTimes(1);
      expect(transformPerformanceSpy).toHaveBeenCalledWith(performanceDTO);
    });
  });

  describe('transformHierarchyGroupPerformance', () => {
    let positionIdMock: string;
    let hierarchyGroupMock: HierarchyGroup;
    let hierarchyGroupPerformanceMock: Performance;
    let hierarchyGroupPerformanceDTOMock: PerformanceDTO;

    beforeEach(inject([ PerformanceTransformerService, CalculatorService ],
      (_performanceTransformerService: PerformanceTransformerService, _calculatorService: CalculatorService) => {
        performanceTransformerService = _performanceTransformerService;
        calculatorService = _calculatorService;

        positionIdMock = chance.string();
        hierarchyGroupMock = {
          name: chance.string(),
          positionDescription: chance.string(),
          type: chance.string(),
          entityType: EntityType.RoleGroup
        };
        hierarchyGroupPerformanceMock = getPerformanceMock();
        hierarchyGroupPerformanceDTOMock = getPerformanceDTOMock();
    }));

    it('should return an EntityWithPerformance given a hierarchy group, its performance, and positionId', () => {
      spyOn(performanceTransformerService, 'transformHierarchyGroupPerformance').and.callThrough();
      spyOn(performanceTransformerService, 'transformPerformanceDTO').and.returnValue(hierarchyGroupPerformanceMock);

      const actualTransformedEntity: EntityWithPerformance = performanceTransformerService.transformHierarchyGroupPerformance(
        hierarchyGroupPerformanceDTOMock,
        hierarchyGroupMock,
        positionIdMock);

      const expectedTransformedEntity: EntityWithPerformance = {
        positionId: positionIdMock,
        name: hierarchyGroupMock.name,
        entityType: EntityType.RoleGroup,
        positionDescription: hierarchyGroupMock.positionDescription,
        entityTypeCode: hierarchyGroupMock.type,
        performance: hierarchyGroupPerformanceMock,
        isMemberOfExceptionHierarchy: hierarchyGroupMock.isMemberOfExceptionHierarchy
      };

      expect(actualTransformedEntity).toEqual(expectedTransformedEntity);
    });

    it('should contain an empty string for positionDescription if the given hierarchy group does not have a positionDescription', () => {
      spyOn(performanceTransformerService, 'transformHierarchyGroupPerformance').and.callThrough();
      spyOn(performanceTransformerService, 'transformPerformanceDTO').and.returnValue(hierarchyGroupPerformanceMock);

      delete hierarchyGroupMock.positionDescription;

      const actualTransformedEntity: EntityWithPerformance = performanceTransformerService.transformHierarchyGroupPerformance(
        hierarchyGroupPerformanceDTOMock,
        hierarchyGroupMock,
        positionIdMock);

      const expectedTransformedEntity: EntityWithPerformance = {
        positionId: positionIdMock,
        name: hierarchyGroupMock.name,
        entityType: EntityType.RoleGroup,
        positionDescription: '',
        entityTypeCode: hierarchyGroupMock.type,
        performance: hierarchyGroupPerformanceMock,
        isMemberOfExceptionHierarchy: hierarchyGroupMock.isMemberOfExceptionHierarchy
      };

      expect(actualTransformedEntity).toEqual(expectedTransformedEntity);
    });

    it('should contain an alternateHierarchyId if the given hierarchy group has one', () => {
      spyOn(performanceTransformerService, 'transformHierarchyGroupPerformance').and.callThrough();
      spyOn(performanceTransformerService, 'transformPerformanceDTO').and.returnValue(hierarchyGroupPerformanceMock);

      hierarchyGroupMock.alternateHierarchyId = chance.string();

      const actualTransformedEntity: EntityWithPerformance = performanceTransformerService.transformHierarchyGroupPerformance(
        hierarchyGroupPerformanceDTOMock,
        hierarchyGroupMock,
        positionIdMock);

      const expectedTransformedEntity: EntityWithPerformance = {
        positionId: positionIdMock,
        name: hierarchyGroupMock.name,
        entityType: EntityType.RoleGroup,
        positionDescription: hierarchyGroupMock.positionDescription,
        entityTypeCode: hierarchyGroupMock.type,
        alternateHierarchyId: hierarchyGroupMock.alternateHierarchyId,
        performance: hierarchyGroupPerformanceMock,
        isMemberOfExceptionHierarchy: hierarchyGroupMock.isMemberOfExceptionHierarchy
      };

      expect(actualTransformedEntity).toEqual(expectedTransformedEntity);
    });
  });
});
