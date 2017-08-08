import { inject, TestBed } from '@angular/core/testing';

import { getMockRoleGroups } from '../models/role-groups.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  const mockRoleGroups = getMockRoleGroups();

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
});
