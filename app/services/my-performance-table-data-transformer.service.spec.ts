import { inject, TestBed } from '@angular/core/testing';

import { getMockRoleGroups } from '../models/role-groups.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';

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

      // when actual performance data is added, we can replace the following with:
      // expect(transformedRoleGroupTableData).toEqual(expectedTableData);
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

      // when actual performance data is added, we can replace the following with:
      // expect(transformedPeopleTableData).toEqual(expectedTableData);
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

      // when actual performance data is added, we can replace the following with:
      // expect(transformedTotalRowTableData).toEqual(expectedTableData);
      expect(transformedTotalRowTableData.descriptionRow0).toEqual('TOTAL');
      expect(transformedTotalRowTableData.descriptionRow1).toEqual('MDMs');
    });
  });
});
