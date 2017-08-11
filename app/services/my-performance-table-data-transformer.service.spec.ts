import { inject, TestBed } from '@angular/core/testing';

import { getRoleGroupPerformanceTotalsMock, getRoleGroupsMock } from '../models/role-groups.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { getPerformanceTotalMock } from '../models/performance-total.model.mock';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  const mockRoleGroups = getRoleGroupsMock();
  const mockRoleGroupPerformanceTotals = getRoleGroupPerformanceTotalsMock();
  const mockPerformanceTotal = getPerformanceTotalMock();

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MyPerformanceTableDataTransformerService
    ]
  }));

  describe('transformRoleGroupTableData', () => {
    let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return a collection of formatted table data from RoleGroups', () => {
      spyOn(myPerformanceTableDataTransformerService, 'transformRoleGroupTableData').and.callThrough();
      const transformedRoleGroupTableData =
        myPerformanceTableDataTransformerService.transformRoleGroupTableData(mockRoleGroups);

      // when actual performance data is added, we can replace the following with:
      // expect(transformedRoleGroupTableData).toEqual(expectedTableData);
      expect(transformedRoleGroupTableData[0].descriptionRow0).toEqual(mockRoleGroups.Specialist[0].typeDisplayName);
      expect(transformedRoleGroupTableData[1].descriptionRow0).toEqual(mockRoleGroups.MDM[0].typeDisplayName);
    });
  });

  describe('getTotalRowDisplayData', () => {
    let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return a formatted total row from total performance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getTotalRowDisplayData').and.callThrough();

      const performanceTotalRowData = myPerformanceTableDataTransformerService.getTotalRowDisplayData(mockPerformanceTotal);

      expect(performanceTotalRowData).toEqual({
        descriptionRow0: 'Total',
        metricColumn0: mockPerformanceTotal.total,
        metricColumn1: mockPerformanceTotal.totalYearAgo,
        metricColumn2: parseFloat((mockPerformanceTotal.total / mockPerformanceTotal.totalYearAgo).toFixed(1)),
        ctv: mockPerformanceTotal.contributionToVolume
      });
    });
  });

  describe('getRoleGroupPerformanceTableData', () => {
    let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return a collection of formatted table data from role group performance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getRoleGroupPerformanceTableData').and.callThrough();

      const roleGroupPerformanceTableData =
        myPerformanceTableDataTransformerService.getRoleGroupPerformanceTableData(mockRoleGroupPerformanceTotals);

      expect(roleGroupPerformanceTableData[0].descriptionRow0).toEqual(mockRoleGroupPerformanceTotals[0].entityType);
      expect(roleGroupPerformanceTableData[1].descriptionRow0).toEqual(mockRoleGroupPerformanceTotals[1].entityType);
    });
  });
});
