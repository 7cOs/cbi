import { inject, TestBed } from '@angular/core/testing';

import { getMockRoleGroups } from '../models/role-groups.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { ViewType } from '../enums/view-type.enum';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  const mockRoleGroups = getMockRoleGroups();
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

      expect(transformedRoleGroupTableData[0].descriptionRow0).toEqual(mockRoleGroups.Specialist[0].typeDisplayName);
      expect(transformedRoleGroupTableData[1].descriptionRow0).toEqual(mockRoleGroups.MDM[0].typeDisplayName);
    });
  });

  describe('transformPeopleTableData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return a collection of formatted table data featuring \'positions\'', () => {
      spyOn(myPerformanceTableDataTransformerService, 'transformPeopleTableData').and.callThrough();
      const transformedPeopleTableData =
        myPerformanceTableDataTransformerService.transformPeopleTableData({'MDM': mockRoleGroups.MDM});

      expect(transformedPeopleTableData[0].descriptionRow0).toEqual(mockRoleGroups.MDM[0].name);
    });
  });

  describe('buildTotalRow', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return a formatted totalrow', () => {
      spyOn(myPerformanceTableDataTransformerService, 'transformRoleGroupTableData').and.callThrough();
      const transformedTotalRowTableData =
        myPerformanceTableDataTransformerService.buildTotalRow({'MDM': mockRoleGroups.MDM});

      expect(transformedTotalRowTableData.descriptionRow0).toEqual('TOTAL');
      expect(transformedTotalRowTableData.descriptionRow1).toEqual('MDMs');
    });
  });

  describe('getTableData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
    }));

    it('should return properly formatted table data and total row data when view type is people', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getTableData').and.callThrough();
      const { tableData, totalRowData } =
        myPerformanceTableDataTransformerService.getTableData(ViewType.people, {'MDM': mockRoleGroups.MDM});

        expect(tableData).toBeDefined();
        expect(tableData.length).toBeTruthy();
        expect(totalRowData).toBeDefined();
        expect(tableData[0].descriptionRow0).toBe(mockRoleGroups.MDM[0].name);
        expect(totalRowData.descriptionRow0).toBe('TOTAL');
        expect(totalRowData.descriptionRow1).toBe('MDMs');
    });

    it('should return properly formatted table data without a total row when view type is not people', () =>  {
      spyOn(myPerformanceTableDataTransformerService, 'getTableData').and.callThrough();
      const { tableData, totalRowData } =
        myPerformanceTableDataTransformerService.getTableData(ViewType.roleGroups,  mockRoleGroups);

        expect(tableData).toBeDefined();
        expect(tableData.length).toBeTruthy();
        expect(totalRowData).not.toBeDefined();
        expect(tableData[0].descriptionRow0).toBe(mockRoleGroups.Specialist[0].typeDisplayName);
        expect(tableData[1].descriptionRow0).toBe(mockRoleGroups.MDM[0].typeDisplayName);
    });
  });
});
