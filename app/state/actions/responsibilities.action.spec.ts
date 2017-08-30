import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { getEntityPeopleResponsibilitiesMock,
         getResponsibilityEntitiesPerformanceMock } from '../../models/entity-responsibilities.model.mock';
import { getRoleGroupsMock } from '../../models/role-groups.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ResponsibilityEntityPerformance } from '../../models/entity-responsibilities.model';
import { RoleGroups } from '../../models/role-groups.model';
import * as ResponsibilitiesActions from './responsibilities.action';

const chance = new Chance();

describe('Responsibilities Actions', () => {

  describe('FetchResponsibilitiesAction', () => {
    let action: ResponsibilitiesActions.FetchResponsibilitiesAction;
    let userIdMock: number;
    let actionPayloadMock: any;
    const performanceFilterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.PointsOfDistribution,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On,
      distributionType: DistributionTypeValue.simple
    };

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
    let roleGroupsMock: RoleGroups;
    let userIdMock: number;
    let responsibilityEntitiesPerformanceMock: ResponsibilityEntityPerformance[];
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      roleGroupsMock = getRoleGroupsMock();
      userIdMock = chance.natural();
      responsibilityEntitiesPerformanceMock = getResponsibilityEntitiesPerformanceMock();
      mockSuccessActionPayload = {
        positionId: userIdMock,
        responsibilities: roleGroupsMock,
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

});
