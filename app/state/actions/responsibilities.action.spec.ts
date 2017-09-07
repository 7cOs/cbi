import * as Chance from 'chance';
const chance = new Chance();

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchResponsibilityEntitiesPerformancePayload } from './responsibilities.action';
import { getEntitiesPerformancesMock } from '../../models/entities-performances.model.mock';
import { getEntityPeopleResponsibilitiesMock } from '../../models/entity-responsibilities.model.mock';
import { getPerformanceTotalMock } from '../../models/entities-total-performances.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { EntitiesPerformances } from '../../models/entities-performances.model';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { ViewType } from '../../enums/view-type.enum';
import * as ResponsibilitiesActions from './responsibilities.action';

const performanceFilterStateMock: MyPerformanceFilterState = {
  metricType: MetricTypeValue.PointsOfDistribution,
  dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
  premiseType: PremiseTypeValue.On,
  distributionType: DistributionTypeValue.simple
};

describe('Responsibilities Actions', () => {

  describe('FetchResponsibilitiesAction', () => {
    let action: ResponsibilitiesActions.FetchResponsibilitiesAction;
    let userIdMock: number;
    let actionPayloadMock: any;

    beforeEach(() => {
      userIdMock = chance.natural();
      actionPayloadMock = {
        positionId: userIdMock,
        filter: performanceFilterStateMock
      };
      action = new ResponsibilitiesActions.FetchResponsibilitiesAction(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION).toBe('[Responsibilities] FETCH_RESPONSIBILITIES_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchResponsibilitiesSuccessAction', () => {
    let action: ResponsibilitiesActions.FetchResponsibilitiesSuccessAction;
    let groupedEntitiesMock: GroupedEntities;
    let userIdMock: number;
    let responsibilityEntitiesPerformanceMock: EntitiesPerformances[];
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      groupedEntitiesMock = getGroupedEntitiesMock();
      userIdMock = chance.natural();
      responsibilityEntitiesPerformanceMock = getEntitiesPerformancesMock();
      mockSuccessActionPayload = {
        positionId: userIdMock,
        responsibilities: groupedEntitiesMock,
        performanceTotals: responsibilityEntitiesPerformanceMock
      };

      action = new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchResponsibilitiesFailureAction', () => {
    const error: Error = new Error(chance.string());
    let action: ResponsibilitiesActions.FetchResponsibilitiesFailureAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(error);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('GetPeopleByRoleGroupAction', () => {
    const entityPeopleType = getEntityPeopleResponsibilitiesMock().peopleType;
    let action: ResponsibilitiesActions.GetPeopleByRoleGroupAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.GetPeopleByRoleGroupAction(entityPeopleType);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION)
        .toBe('[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(entityPeopleType);
    });
  });

  describe('FetchResponsibilityEntityPerformance', () => {
    const payloadMock: FetchResponsibilityEntitiesPerformancePayload = {
      entityType: EntityPeopleType['GENERAL MANAGER'],
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      entitiesTotalPerformances: getMyPerformanceTableRowMock(1)[0],
      viewType: ViewType.people
    };
    let action: ResponsibilitiesActions.FetchResponsibilityEntityPerformance;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchResponsibilityEntityPerformance(payloadMock);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchResponsibilityEntityPerformanceSuccess', () => {
    const payloadMock: EntitiesPerformances[] = getEntitiesPerformancesMock();
    let action: ResponsibilitiesActions.FetchResponsibilityEntityPerformanceSuccess;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchResponsibilityEntityPerformanceSuccess(payloadMock);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('Fetch Performance Total Action', () => {
    const positionIdMock: string = chance.string();
    let action: ResponsibilitiesActions.FetchPerformanceTotalAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchPerformanceTotalAction({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      });
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_ACTION).toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      });
    });
  });

  describe('Fetch Performance Total Success Action', () => {
    const performanceTotalMock: EntitiesTotalPerformances = getPerformanceTotalMock();
    let action: ResponsibilitiesActions.FetchPerformanceTotalSuccessAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchPerformanceTotalSuccessAction(performanceTotalMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(performanceTotalMock);
    });
  });

  describe('Fetch Performance Total Failure Action', () => {
    const errorMock: Error = new Error(chance.string());
    let action: ResponsibilitiesActions.FetchPerformanceTotalFailureAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchPerformanceTotalFailureAction(errorMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toBe(errorMock);
    });
  });

  describe('Set Table Row Performance Total Action', () => {
    const tableRowMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
    let action: ResponsibilitiesActions.SetTableRowPerformanceTotal;

    beforeEach(() => {
      action = new ResponsibilitiesActions.SetTableRowPerformanceTotal(tableRowMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.SET_TABLE_ROW_PERFORMANCE_TOTAL).toBe('[Performance Total] SET_TABLE_ROW_PERFORMANCE_TOTAL');
      expect(action.type).toBe(ResponsibilitiesActions.SET_TABLE_ROW_PERFORMANCE_TOTAL);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(tableRowMock);
    });
  });
});
