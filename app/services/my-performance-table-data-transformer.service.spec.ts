import { inject, TestBed } from '@angular/core/testing';

import { getPerformanceTotalMock } from '../models/performance-total.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { getResponsibilityEntitiesPerformanceMock } from '../models/entity-responsibilities.model.mock';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PerformanceTotal } from '../models/performance-total.model';
import { ResponsibilityEntityPerformance } from '../models/entity-responsibilities.model';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let mockPerformanceTotal: PerformanceTotal;
  let responsibilityEntitiesPerformanceMock: ResponsibilityEntityPerformance[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyPerformanceTableDataTransformerService
      ]
    });
  });

  describe('getLeftTableData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
        responsibilityEntitiesPerformanceMock = getResponsibilityEntitiesPerformanceMock();
    }));

    it('should return formatted ResponsibilityEntityPerformance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getLeftTableData').and.callThrough();

      const tableData = myPerformanceTableDataTransformerService.getLeftTableData(responsibilityEntitiesPerformanceMock);

      expect(tableData).toBeDefined();
      expect(tableData.length).toBeTruthy();
      expect(tableData[0]).toEqual({
        descriptionRow0: responsibilityEntitiesPerformanceMock[0].name,
        metricColumn0: responsibilityEntitiesPerformanceMock[0].performanceTotal.total,
        metricColumn1: responsibilityEntitiesPerformanceMock[0].performanceTotal.totalYearAgo,
        metricColumn2: responsibilityEntitiesPerformanceMock[0].performanceTotal.totalYearAgoPercent,
        ctv: responsibilityEntitiesPerformanceMock[0].performanceTotal.contributionToVolume
      });
    });
  });

  describe('getTotalRowData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
        mockPerformanceTotal = getPerformanceTotalMock();
    }));

    it('should return a formatted total row from total performance data', () => {
      spyOn(myPerformanceTableDataTransformerService, 'getTotalRowData').and.callThrough();

      const performanceTotalRowData = myPerformanceTableDataTransformerService.getTotalRowData(mockPerformanceTotal);

      expect(performanceTotalRowData).toEqual({
        descriptionRow0: 'Total',
        metricColumn0: mockPerformanceTotal.total,
        metricColumn1: mockPerformanceTotal.totalYearAgo,
        metricColumn2: mockPerformanceTotal.totalYearAgoPercent,
        ctv: mockPerformanceTotal.contributionToVolume
      });
    });
  });
});
