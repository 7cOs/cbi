import { getTestBed, TestBed } from '@angular/core/testing';
import * as moment from 'moment';

import { CalculatorService } from '../calculator.service';
import { getListPerformanceMock } from '../../models/lists/list-performance.model.mock';
import { getListStorePerformanceMock } from '../../models/lists/list-store-performance.model.mock';
import { getStoreListsMock } from '../../models/lists/lists-store.model.mock';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListsTableTransformerService } from './lists-table-transformer.service';
import { ListStorePerformance } from '../../models/lists/list-store-performance.model';
import { PERFORMANCE_TOTAL_ROW_NAME } from './lists-table-transformer.service';
import { StoreDetails } from '../../models/lists/lists-store.model';

const getExpectedStoreAddress = (store: StoreDetails): string => {
  return `${ store.address } ${ store.city } ${ store.state } ${ store.postalCode }`;
};

describe('ListsTableTransformerService', () => {
  let testBed: TestBed;
  let listsTableTransformerService: ListsTableTransformerService;
  let calculatorService: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        ListsTableTransformerService
      ]
    });

    testBed = getTestBed();
    listsTableTransformerService = testBed.get(ListsTableTransformerService);
    calculatorService = testBed.get(CalculatorService);
  });

  describe('transformPerformanceCollection', () => {
    let storeDetailsMock: StoreDetails[];
    let volumeStorePerformanceMock: ListStorePerformance[];
    let podStorePerformanceMock: ListStorePerformance[];

    beforeEach(() => {
      storeDetailsMock = getStoreListsMock();
      volumeStorePerformanceMock = Array(storeDetailsMock.length).fill(getListStorePerformanceMock());
      podStorePerformanceMock = Array(storeDetailsMock.length).fill(getListStorePerformanceMock());
    });

    describe('when each store has Volume and POD performance data', () => {
      beforeEach(() => {
        volumeStorePerformanceMock = volumeStorePerformanceMock.map((storePerformance: ListStorePerformance, index: number) => {
          return Object.assign({}, storePerformance, {
            unversionedStoreId: storeDetailsMock[index].unversionedStoreId
          });
        });
        podStorePerformanceMock = volumeStorePerformanceMock.map((storePerformance: ListStorePerformance, index: number) => {
          return Object.assign({}, storePerformance, {
            unversionedStoreId: storeDetailsMock[index].unversionedStoreId
          });
        });
      });

      it('should return a ListPerformanceTableRow for each store with its matched performance data', () => {
        const tableRows: ListPerformanceTableRow[] = listsTableTransformerService.transformPerformanceCollection(
          storeDetailsMock,
          volumeStorePerformanceMock,
          podStorePerformanceMock
        );

        tableRows.forEach((row: ListPerformanceTableRow, index: number) => {
          expect(row).toEqual({
            storeColumn: storeDetailsMock[index].name,
            storeAddressSubline: getExpectedStoreAddress(storeDetailsMock[index]),
            distributorColumn: storeDetailsMock[index].distributor,
            segmentColumn: storeDetailsMock[index].segmentCode,
            cytdColumn: volumeStorePerformanceMock[index].current,
            cytdVersusYaColumn: volumeStorePerformanceMock[index].yearAgo,
            cytdVersusYaPercentColumn: calculatorService.getYearAgoPercent(
              volumeStorePerformanceMock[index].current,
              volumeStorePerformanceMock[index].yearAgo
            ),
            l90Column: podStorePerformanceMock[index].current,
            l90VersusYaColumn: podStorePerformanceMock[index].yearAgo,
            l90VersusYaPercentColumn: calculatorService.getYearAgoPercent(
              podStorePerformanceMock[index].current,
              podStorePerformanceMock[index].yearAgo
            ),
            lastDepletionDateColumn: moment(volumeStorePerformanceMock[index].lastSoldDate).format('MM/DD/YY'),
            performanceError: false,
            checked: false
          });
        });
      });
    });

    describe('when stores don`t have any matched volume or pod performance data', () => {
      it('should return table rows with zero values for the performance fields, a `-` for the lastDepletionDateColumn, and'
      + ' performanceError set to true', () => {
        const tableRows: ListPerformanceTableRow[] = listsTableTransformerService.transformPerformanceCollection(
          storeDetailsMock,
          volumeStorePerformanceMock,
          podStorePerformanceMock
        );

        tableRows.forEach((row: ListPerformanceTableRow, index: number) => {
          expect(row).toEqual({
            storeColumn: storeDetailsMock[index].name,
            storeAddressSubline: getExpectedStoreAddress(storeDetailsMock[index]),
            distributorColumn: storeDetailsMock[index].distributor,
            segmentColumn: storeDetailsMock[index].segmentCode,
            cytdColumn: 0,
            cytdVersusYaColumn: 0,
            cytdVersusYaPercentColumn: 0,
            l90Column: 0,
            l90VersusYaColumn: 0,
            l90VersusYaPercentColumn: 0,
            lastDepletionDateColumn: '-',
            performanceError: true,
            checked: false
          });
        });
      });
    });
  });

  describe('transformPerformanceTotal', () => {
    let volumePerformanceMock: ListPerformance;
    let podPerformanceMock: ListPerformance;

    beforeEach(() => {
      volumePerformanceMock = getListPerformanceMock();
      podPerformanceMock = getListPerformanceMock();
    });

    it('should return a ListPerformanceTableRow with the passed in performance values and total for its name', () => {
      const tableRow: ListPerformanceTableRow = listsTableTransformerService.transformPerformanceTotal(
        volumePerformanceMock,
        podPerformanceMock
      );

      expect(tableRow).toEqual({
        storeColumn: PERFORMANCE_TOTAL_ROW_NAME,
        storeAddressSubline: '',
        distributorColumn: '',
        segmentColumn: '',
        cytdColumn: volumePerformanceMock.current,
        cytdVersusYaColumn: volumePerformanceMock.yearAgo,
        cytdVersusYaPercentColumn: calculatorService.getYearAgoPercent(volumePerformanceMock.current, volumePerformanceMock.yearAgo),
        l90Column: podPerformanceMock.current,
        l90VersusYaColumn: podPerformanceMock.yearAgo,
        l90VersusYaPercentColumn: calculatorService.getYearAgoPercent(podPerformanceMock.current, podPerformanceMock.yearAgo),
        lastDepletionDateColumn: '',
        performanceError: false,
        checked: false
      });
    });
  });
});
