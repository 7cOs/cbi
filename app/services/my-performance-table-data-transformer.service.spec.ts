import { inject, TestBed } from '@angular/core/testing';

import { getEntitiesTotalPerformancesMock } from '../models/entities-total-performances.model.mock';
import { MyPerformanceTableDataTransformerService } from './my-performance-table-data-transformer.service';
import { getEntitiesPerformancesMock } from '../models/entities-performances.model.mock';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { EntitiesPerformances } from '../models/entities-performances.model';

describe('Service: MyPerformanceTableDataTransformerService', () => {
  let myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService;
  let mockPerformanceTotal: EntitiesTotalPerformances;
  let responsibilityEntitiesPerformanceMock: EntitiesPerformances[];

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
        responsibilityEntitiesPerformanceMock = getEntitiesPerformancesMock();
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
        ctv: responsibilityEntitiesPerformanceMock[0].performanceTotal.contributionToVolume,
        metadata: {
          positionId: responsibilityEntitiesPerformanceMock[0].positionId
        }
      });
    });
  });

  describe('getTotalRowData', () => {
    beforeEach(inject([ MyPerformanceTableDataTransformerService ],
      (_myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) => {
        myPerformanceTableDataTransformerService = _myPerformanceTableDataTransformerService;
        mockPerformanceTotal = getEntitiesTotalPerformancesMock();
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
