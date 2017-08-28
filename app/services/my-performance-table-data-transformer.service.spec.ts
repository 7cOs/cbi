import { inject, TestBed } from '@angular/core/testing';

import { getPerformanceTotalMock } from '../models/performance-total.model.mock';
import { getRoleGroupPerformanceTotalsMock, getRoleGroupsMock } from '../models/role-groups.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { ViewType } from '../enums/view-type.enum';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  const mockRoleGroups = getRoleGroupsMock();
  const mockRoleGroupPerformanceTotals = getRoleGroupPerformanceTotalsMock();
  const mockPerformanceTotal = getPerformanceTotalMock();
  const mockResponsibilitiesState: any = {
    responsibilities: mockRoleGroups,
    performanceTotals: mockRoleGroupPerformanceTotals
  };
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyPerformanceTableDataTransformerService
      ]
    });
  });

  describe('transformRoleGroupTableData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return a collection of formatted table data from RoleGroups', () => {
      spyOn(myPerformanceTableDataTransformerService, 'transformRoleGroupTableData').and.callThrough();
      const transformedRoleGroupTableData =
        myPerformanceTableDataTransformerService.transformRoleGroupTableData(mockRoleGroups);

      expect(transformedRoleGroupTableData[0].descriptionRow0).toEqual(mockRoleGroups['GENERAL MANAGER'][0].description);
      expect(transformedRoleGroupTableData[1].descriptionRow0).toEqual(mockRoleGroups['MARKET DEVELOPMENT MANAGER'][0].description);
    });
  });

  // describe('transformPeopleTableData', () => {
  //   beforeEach(inject([ MyPerformanceTableDataTransformerService ],
  //     (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
  //       myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
  //   }));

  //   it('should return a collection of formatted table data featuring \'positions\'', () => {
  //     spyOn(myPerformanceTableDataTransformerService, 'transformPeopleTableData').and.callThrough();
  //     const transformedPeopleTableData =
  //       myPerformanceTableDataTransformerService.transformPeopleTableData({
  //         'MARKET DEVELOPMENT MANAGER': mockRoleGroups['MARKET DEVELOPMENT MANAGER']
  //       });

  //     expect(transformedPeopleTableData[0].descriptionRow0).toEqual(mockRoleGroups['MARKET DEVELOPMENT MANAGER'][0].name);
  //   });
  // });

  describe('buildTotalRow', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return a formatted totalrow', () => {
      spyOn(myPerformanceTableDataTransformerService, 'transformRoleGroupTableData').and.callThrough();
      const transformedTotalRowTableData =
        myPerformanceTableDataTransformerService.buildTotalRow({
          'MARKET DEVELOPMENT MANAGER': mockRoleGroups['MARKET DEVELOPMENT MANAGER']
        });

      expect(transformedTotalRowTableData.descriptionRow0).toEqual('TOTAL');
      expect(transformedTotalRowTableData.descriptionRow1).toEqual('MARKET DEVELOPMENT MANAGERS');
    });
  });

  describe('getTableData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return properly formatted table data when view type is people', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getTableData').and.callThrough();

      const tableData = myPerformanceTableDataTransformerService.getTableData(ViewType.people, mockResponsibilitiesState);

        expect(tableData).toBeDefined();
        expect(tableData.length).toBeTruthy();
        expect(tableData[0].descriptionRow0).toBe(mockRoleGroups['GENERAL MANAGER'][0].name);
    });

    it('should return properly formatted table data without a total row when view type is roleGroups', () =>  {
      spyOn(myPerformanceTableDataTransformerService, 'getTableData').and.callThrough();
      const tableData = myPerformanceTableDataTransformerService.getTableData(ViewType.roleGroups, mockResponsibilitiesState);

        expect(tableData).toBeDefined();
        expect(tableData.length).toBeTruthy();
        expect(tableData[0].descriptionRow0).toBe(mockRoleGroupPerformanceTotals[0].entityType + 'S');
        expect(tableData[1].descriptionRow0).toBe(mockRoleGroupPerformanceTotals[1].entityType + 'S');
    });
  });

  describe('getTotalRowDisplayData', () => {
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
        metricColumn2: mockPerformanceTotal.totalYearAgoPercent,
        ctv: mockPerformanceTotal.contributionToVolume
      });
    });
  });

  describe('getRoleGroupPerformanceTableData', () => {
    it('should return a collection of formatted table data from role group performance data', () => {
      const roleGroupPerformanceTableData =
        myPerformanceTableDataTransformerService.getRoleGroupPerformanceTableData(mockRoleGroupPerformanceTotals);

      expect(roleGroupPerformanceTableData[0].descriptionRow0).toEqual(mockRoleGroupPerformanceTotals[0].entityType + 'S');
      expect(roleGroupPerformanceTableData[1].descriptionRow0).toEqual(mockRoleGroupPerformanceTotals[1].entityType + 'S');
    });
  });
});
