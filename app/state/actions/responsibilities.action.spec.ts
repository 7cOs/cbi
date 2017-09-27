import * as Chance from 'chance';
const chance = new Chance();

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchEntityWithPerformancePayload,
         FetchSubAccountsActionPayload,
         FetchSubAccountsSuccessPayload } from './responsibilities.action';
import { getEntitiesWithPerformancesMock } from '../../models/entity-with-performance.model.mock';
import { getEntityPeopleResponsibilitiesMock } from '../../models/hierarchy-entity.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { Performance } from '../../models/performance.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { EntityWithPerformance } from '../../models/entity-with-performance.model';
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

  describe('FetchResponsibilities', () => {
    let action: ResponsibilitiesActions.FetchResponsibilities;
    let positionIdMock: number;
    let actionPayloadMock: any;

    beforeEach(() => {
      positionIdMock = chance.natural();
      actionPayloadMock = {
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      };
      action = new ResponsibilitiesActions.FetchResponsibilities(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES).toBe('[Responsibilities] FETCH_RESPONSIBILITIES');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchResponsibilitiesSuccess', () => {
    let action: ResponsibilitiesActions.FetchResponsibilitiesSuccess;
    let groupedEntitiesMock: GroupedEntities;
    let positionIdMock: number;
    let responsibilityEntitiesPerformanceMock: EntityWithPerformance[];
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      groupedEntitiesMock = getGroupedEntitiesMock();
      positionIdMock = chance.natural();
      responsibilityEntitiesPerformanceMock = getEntitiesWithPerformancesMock();
      mockSuccessActionPayload = {
        positionId: positionIdMock,
        responsibilities: groupedEntitiesMock,
        performances: responsibilityEntitiesPerformanceMock
      };

      action = new ResponsibilitiesActions.FetchResponsibilitiesSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchResponsibilitiesFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ResponsibilitiesActions.FetchResponsibilitiesFailure;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchResponsibilitiesFailure(error);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE);
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
      expect(ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION).toBe('[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(entityPeopleType);
    });
  });

  describe('FetchEntityWithPerformance', () => {
    const payloadMock: FetchEntityWithPerformancePayload = {
      entityType: EntityPeopleType['GENERAL MANAGER'],
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
      viewType: ViewType.people
    };
    let action: ResponsibilitiesActions.FetchEntityWithPerformance;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchEntityWithPerformance(payloadMock);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES)
        .toBe('[Responsibilities] FETCH_ENTITIES_PERFORMANCES');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchEntityWithPerformanceSuccess', () => {
    const payloadMock: EntityWithPerformance[] = getEntitiesWithPerformancesMock();
    let action: ResponsibilitiesActions.FetchEntityWithPerformanceSuccess;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchEntityWithPerformanceSuccess(payloadMock);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES_SUCCESS)
        .toBe('[Responsibilities] FETCH_ENTITIES_PERFORMANCES_SUCCESS');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('Fetch Performance Total Action', () => {
    const positionIdMock: string = chance.string();
    let action: ResponsibilitiesActions.FetchTotalPerformance;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchTotalPerformance({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      });
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE).toBe('[Performance Total] FETCH_TOTAL_PERFORMANCE');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      });
    });
  });

  describe('Fetch Performance Total Success Action', () => {
    const performanceMock: Performance = getPerformanceMock();
    let action: ResponsibilitiesActions.FetchTotalPerformanceSuccess;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchTotalPerformanceSuccess(performanceMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_SUCCESS)
        .toBe('[Performance Total] FETCH_TOTAL_PERFORMANCE_SUCCESS');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_SUCCESS);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(performanceMock);
    });
  });

  describe('Fetch Performance Total Failure Action', () => {
    const errorMock: Error = new Error(chance.string());
    let action: ResponsibilitiesActions.FetchTotalPerformanceFailure;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchTotalPerformanceFailure(errorMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_FAILURE)
        .toBe('[Performance Total] FETCH_TOTAL_PERFORMANCE_FAILURE');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_FAILURE);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toBe(errorMock);
    });
  });

  describe('Set Table Row Performance Total Action', () => {
    const selectedPositionIdMock: string = getMyPerformanceTableRowMock(1)[0].metadata.positionId;
    let action: ResponsibilitiesActions.SetTotalPerformance;

    beforeEach(() => {
      action = new ResponsibilitiesActions.SetTotalPerformance(selectedPositionIdMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.SET_TOTAL_PERFORMANCE).toBe('[Performance Total] SET_TOTAL_PERFORMANCE');
      expect(action.type).toBe(ResponsibilitiesActions.SET_TOTAL_PERFORMANCE);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(selectedPositionIdMock);
    });
  });

  describe('FetchSubAccountsAction', () => {
    const payloadMock: FetchSubAccountsActionPayload = {
      positionId: chance.string({pool: '0123456789'}),
      contextPositionId: chance.string({pool: '0123456789'}),
      entityType: chance.string(),
      selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
      premiseType: PremiseTypeValue.All,
      filter: performanceFilterStateMock
    };
    let action: ResponsibilitiesActions.FetchSubAccountsAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchSubAccountsAction(payloadMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_SUBACCOUNTS_ACTION).toBe('[Responsibilities] FETCH_SUBACCOUNTS_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_SUBACCOUNTS_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchSubAccountsSuccessAction', () => {
    const payloadMock: FetchSubAccountsSuccessPayload = {
      groupedEntities: getGroupedEntitiesMock(),
      entityWithPerformance: getEntitiesWithPerformancesMock()
    };
    let action: ResponsibilitiesActions.FetchSubAccountsSuccessAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchSubAccountsSuccessAction(payloadMock);
    });

    it('should be the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_SUBACCOUNTS_SUCCESS_ACTION).toBe('[Responsibilities] FETCH_SUBACCOUNTS_SUCCESS_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_SUBACCOUNTS_SUCCESS_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(payloadMock);
    });
  });
});
