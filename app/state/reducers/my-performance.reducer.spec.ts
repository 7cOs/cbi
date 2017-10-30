import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { initialState, myPerformanceReducer, MyPerformanceState } from './my-performance.reducer';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';
import * as MyPerformanceFilterReducer from './my-performance-filter.reducer';
import { MyPerformanceFilterState } from './my-performance-filter.reducer';
import * as myPerformanceVersion from './my-performance-version.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as responsibilities from './responsibilities.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import * as SalesHierarchyViewTypeActions from '../actions/sales-hierarchy-view-type.action';
import * as salesHierarchyViewTypeReducer from './sales-hierarchy-view-type.reducer';

const chance = new Chance();

describe('My Performance Reducer', () => {
  let myPerformanceFilterStateMock: MyPerformanceFilterState;
  let myPerformanceVersionReducerSpy: jasmine.Spy;
  let responsibilitiesReducerSpy: jasmine.Spy;
  let salesHierarchyViewTypeReducerSpy: jasmine.Spy;
  let myPerformanceFilterReducerSpy: jasmine.Spy;

  beforeEach(() => {
    myPerformanceFilterStateMock = getMyPerformanceFilterMock();
    myPerformanceVersionReducerSpy = spyOn(myPerformanceVersion, 'myPerformanceVersionReducer').and.callFake(() => {});
    responsibilitiesReducerSpy = spyOn(responsibilities, 'responsibilitiesReducer').and.callFake(() => {});
    salesHierarchyViewTypeReducerSpy = spyOn(salesHierarchyViewTypeReducer, 'salesHierarchyViewTypeReducer').and.callFake(() => {});
    myPerformanceFilterReducerSpy = spyOn(MyPerformanceFilterReducer, 'myPerformanceFilterReducer').and.returnValue(
      myPerformanceFilterStateMock);
  });

  describe('when a my performance version action is received', () => {
    it('should call the versioning reducer when a versioning action is received', () => {
      myPerformanceReducer(initialState, new MyPerformanceVersionActions.SaveMyPerformanceState(null));
      myPerformanceReducer(initialState, new MyPerformanceVersionActions.RestoreMyPerformanceState());
      myPerformanceReducer(initialState, new MyPerformanceVersionActions.SetMyPerformanceSelectedEntity(chance.string()));
      myPerformanceReducer(initialState, new MyPerformanceVersionActions.ClearMyPerformanceState);

      expect(myPerformanceVersionReducerSpy).toHaveBeenCalledTimes(4);
      expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
      expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
      expect(myPerformanceFilterReducerSpy).not.toHaveBeenCalled();
    });
  });

  describe('when a responsibilities action is received', () => {
    it('should call the responsibilities reducer', () => {
      myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilities({
        positionId: chance.string(),
        filter: null,
        selectedEntityDescription: chance.string()
      }));
      myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
        positionId: chance.string(),
        groupedEntities: {},
        hierarchyGroups: [],
        entityWithPerformance: []
      }));
      myPerformanceReducer(
        initialState,
        new ResponsibilitiesActions.SetTotalPerformance(chance.string())
      );
      myPerformanceReducer(
        initialState,
        new ResponsibilitiesActions.SetTotalPerformanceForSelectedRoleGroup(chance.string())
      );
      myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesFailure(new Error()));

      expect(responsibilitiesReducerSpy).toHaveBeenCalled();
      expect(responsibilitiesReducerSpy.calls.count()).toBe(5);
      expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
      expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
      expect(myPerformanceFilterReducerSpy).not.toHaveBeenCalled();
    });

    it('should update selectedEntityDescription when the action payload contains a selectedEntityDescription', () => {
      const expectedSelectedEntityDescription = chance.string();
      const actualState: MyPerformanceState = myPerformanceReducer(initialState, new ResponsibilitiesActions.FetchResponsibilities({
        positionId: chance.string(),
        filter: null,
        selectedEntityDescription: expectedSelectedEntityDescription
      }));

      expect(actualState.current.selectedEntityDescription).toBe(expectedSelectedEntityDescription);
    });

    it('should NOT modify selectedEntityDescription when a the action payload contains no selectedEntityDescription', () => {
      const initialSelectedEntityDescription = chance.string();
      const startingState: MyPerformanceState = Object.assign({}, initialState, {
        current: Object.assign({}, initialState.current, {
          selectedEntityDescription: initialSelectedEntityDescription
        })
      });
      const actualState: MyPerformanceState = myPerformanceReducer(startingState, new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
        positionId: chance.string(),
        groupedEntities: {},
        hierarchyGroups: [],
        entityWithPerformance: []
      }));

      expect(actualState.current.selectedEntityDescription).toBe(initialSelectedEntityDescription);
    });
  });

  describe('when a sales hierarchy view type action is received', () => {
    it('should call the salesHierarchyViewType reducer', () => {
      myPerformanceReducer(initialState, new SalesHierarchyViewTypeActions.SetSalesHierarchyViewType(
        SalesHierarchyViewType[getSalesHierarchyViewTypeMock()])
      );

      expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
      expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
      expect(salesHierarchyViewTypeReducerSpy).toHaveBeenCalled();
      expect(myPerformanceFilterReducerSpy).not.toHaveBeenCalled();
      expect(salesHierarchyViewTypeReducerSpy.calls.count()).toBe(1);
    });
  });

  describe('when a my performance filter action is received', () => {
    it('should call the MyPerformanceFilter reducer', () => {
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetMetric(MetricTypeValue.volume));
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetTimePeriod(DateRangeTimePeriodValue.FYTDBDL));
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.Off));
      myPerformanceReducer(initialState, new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.effective));

      expect(myPerformanceFilterReducerSpy).toHaveBeenCalled();
      expect(myPerformanceFilterReducerSpy.calls.count()).toBe(4);
      expect(myPerformanceFilterReducerSpy.calls.argsFor(0)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetMetric(MetricTypeValue.volume)]);
      expect(myPerformanceFilterReducerSpy.calls.argsFor(1)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetTimePeriod(DateRangeTimePeriodValue.FYTDBDL)]);
      expect(myPerformanceFilterReducerSpy.calls.argsFor(2)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.Off)]);
      expect(myPerformanceFilterReducerSpy.calls.argsFor(3)).toEqual([
        MyPerformanceFilterReducer.initialState,
        new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.effective)]);
      expect(myPerformanceVersionReducerSpy).not.toHaveBeenCalled();
      expect(responsibilitiesReducerSpy).not.toHaveBeenCalled();
      expect(salesHierarchyViewTypeReducerSpy).not.toHaveBeenCalled();
    });

    it('should update current.filter of MyPerformanceState', () => {
      const actualState: MyPerformanceState = myPerformanceReducer(
        initialState,
        new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.effective));

      const expectedState: MyPerformanceState = {
        current: {
          responsibilities: initialState.current.responsibilities,
          salesHierarchyViewType: initialState.current.salesHierarchyViewType,
          selectedEntityDescription: initialState.current.selectedEntityDescription,
          selectedEntityType: initialState.current.selectedEntityType,
          filter: myPerformanceFilterStateMock
        },
        versions: initialState.versions
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an unknown action is received', () => {
    it('should return current state', () => {
      expect(myPerformanceReducer(
        initialState,
        { type: 'UNKNOWN_ACTION' } as any)).toBe(initialState);
    });
  });
});
