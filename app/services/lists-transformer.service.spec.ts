import { getTestBed, TestBed } from '@angular/core/testing';
import { sample } from 'lodash';

import { CollaboratorType } from '../enums/lists/collaborator-type.enum';
import { getListOpportunitiesDTOMock } from '../models/lists/lists-opportunities-dto.model.mock';
import { getListOpportunityMock } from '../models/lists/lists-opportunities.model.mock';
import { getListPerformanceDTOMock } from '../models/lists/list-performance-dto.model.mock';
import { getListsSummaryDTOMock } from '../models/lists/lists-header-dto.model.mock';
import { getListsSummaryMock } from '../models/lists/lists-header.model.mock';
import { getStoreListsDTOMock } from '../models/lists/lists-store-dto.model.mock';
import { ListCategory } from '../enums/lists/list-category.enum';
import { ListsOpportunities } from '../models/lists/lists-opportunities.model';
import { ListOpportunityDTO } from '../models/lists/lists-opportunities-dto.model';
import { ListPerformance } from '../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../models/lists/list-performance-dto.model';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
import { ListStorePerformance } from '../models/lists/list-store-performance.model';
import { ListStorePerformanceDTO } from '../models/lists/list-store-performance-dto.model';
import { ListsTransformerService } from './lists-transformer.service';
import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { ListType } from '../enums/lists/list-type.enum';
import { FormattedNewList } from '../models/lists/formatted-new-list.model';
import { StoreDetails } from '../models/lists/lists-store.model';
import { User } from '../models/lists/user.model';

describe('Service: ListsTransformerService', () => {
  let listsTransformerService: ListsTransformerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ListsTransformerService]
  }));

  let testBed: TestBed;

  beforeEach(() => {
    testBed = getTestBed();
    listsTransformerService = testBed.get(ListsTransformerService);
  });

  describe('transformStoresData', () => {
    it('should transform the stores Data', () => {
      const storesDTOMock: Array<ListStoreDTO> = getStoreListsDTOMock();

      const actualStoreData: StoreDetails[] =
        listsTransformerService.formatStoresData(storesDTOMock);

      actualStoreData.forEach((row: StoreDetails, i: number) => {
        expect(row).toEqual({
          address: storesDTOMock[i].address,
          city: storesDTOMock[i].city,
          name: storesDTOMock[i].name,
          unversionedStoreId: storesDTOMock[i].storeSourceCode,
          number: storesDTOMock[i].number,
          postalCode: storesDTOMock[i].postalCode,
          premiseType: storesDTOMock[i].premiseType,
          state: storesDTOMock[i].state,
          segmentCode: storesDTOMock[i].segmentCode,
          distributor: storesDTOMock[i].primaryBeerDistributor.name,
          beerDistributors: storesDTOMock[i].beerDistributors
        });
      });
    });
  });

  describe('transformListOpportunitiesData', () => {
    it('should transform the list opportunities Data', () => {
      const listsOpportunitiesDTOMock: Array<ListOpportunityDTO> = getListOpportunitiesDTOMock();

      const actualListOppsData: ListsOpportunities[] =
        listsTransformerService.formatListOpportunitiesData(listsOpportunitiesDTOMock);

        actualListOppsData.forEach((row: ListsOpportunities, i: number) => {
        expect(row).toEqual({
          id: listsOpportunitiesDTOMock[i].id,
          brandCode: listsOpportunitiesDTOMock[i].brandCode,
          brandDescription: listsOpportunitiesDTOMock[i].brandDescription,
          skuDescription: listsOpportunitiesDTOMock[i].skuDescription,
          type: listsOpportunitiesDTOMock[i].type,
          subType: listsOpportunitiesDTOMock[i].subType,
          status: listsOpportunitiesDTOMock[i].status,
          impact: listsOpportunitiesDTOMock[i].impact,
          currentDepletions_CYTD: listsOpportunitiesDTOMock[i].currentDepletions_CYTD,
          yearAgoDepletions_CYTD: listsOpportunitiesDTOMock[i].yearAgoDepletions_CYTD,
          lastDepletionDate: listsOpportunitiesDTOMock[i].lastDepletionDate,
          unversionedStoreId: listsOpportunitiesDTOMock[i].storeSourceCode,
          isSimpleDistribution: listsOpportunitiesDTOMock[i].isSimpleDistributionOpportunity,
          rationale: listsOpportunitiesDTOMock[i].rationale,
          featureType: {
            featureTypeCode: listsOpportunitiesDTOMock[i].featureTypeCode,
            featureTypeDescription: listsOpportunitiesDTOMock[i].featureTypeDescription,
            featurePeriodBeginDate: listsOpportunitiesDTOMock[i].featurePeriodBeginDate,
            featurePeriodEndDate: listsOpportunitiesDTOMock[i].featurePeriodEndDate,
            featureResetBeginDate: listsOpportunitiesDTOMock[i].featureResetBeginDate,
            featureResetEndDate: listsOpportunitiesDTOMock[i].featureResetEndDate,
            featurePrice: listsOpportunitiesDTOMock[i].featurePrice,
            featureIsOnMenu: listsOpportunitiesDTOMock[i].featureIsOnMenu,
            featureNotes: listsOpportunitiesDTOMock[i].featureNotes
          },
          itemAuthorization: {
            itemAuthorizationCode: listsOpportunitiesDTOMock[i].itemAuthorizationCode,
            itemAuthorizationDescription: listsOpportunitiesDTOMock[i].itemAuthorizationDescription,
            itemAuthorizationPeriodBeginDate: listsOpportunitiesDTOMock[i].itemAuthorizationPeriodBeginDate,
            itemAuthorizationPeriodEndDate: listsOpportunitiesDTOMock[i].itemAuthorizationPeriodEndDate,
            itemAuthorizationResetBeginDate: listsOpportunitiesDTOMock[i].itemAuthorizationResetBeginDate,
            itemAuthorizationResetEndDate: listsOpportunitiesDTOMock[i].itemAuthorizationResetEndDate,
            itemAuthorizationPrice: listsOpportunitiesDTOMock[i].itemAuthorizationPrice,
            itemAuthorizationIsOnMenu: listsOpportunitiesDTOMock[i].itemAuthorizationIsOnMenu,
            itemAuthorizationNotes: listsOpportunitiesDTOMock[i].itemAuthorizationNotes
          }
        });
      });
    });
  });

  describe('groupOpportunitiesByStore', () => {
    let opportunitiesMockFirst, opportunitiesMockSecond: ListsOpportunities;
    let allOpps: ListsOpportunities[] = [];
    let expectedObject = {};
    const oppsForFirstStore: ListsOpportunities[] = [];
    const oppsForSecondStore: ListsOpportunities[] = [];

    beforeEach(() => {
      opportunitiesMockFirst = getListOpportunityMock();
      opportunitiesMockSecond = getListOpportunityMock();

      allOpps.push.apply(allOpps, [opportunitiesMockFirst, opportunitiesMockFirst]);
      allOpps.push.apply(allOpps, [opportunitiesMockSecond, opportunitiesMockSecond, opportunitiesMockSecond]);

      oppsForFirstStore.push.apply(oppsForFirstStore, [opportunitiesMockFirst, opportunitiesMockFirst]);
      oppsForSecondStore.push.apply(oppsForSecondStore, [opportunitiesMockSecond, opportunitiesMockSecond, opportunitiesMockSecond]);

      expectedObject[opportunitiesMockFirst.unversionedStoreId] = oppsForFirstStore;
      expectedObject[opportunitiesMockSecond.unversionedStoreId] = oppsForSecondStore;
    });

    it('should group opportunties by stores', () => {
      const groupedObj = listsTransformerService.groupOppsByStore(allOpps);
      expect(groupedObj).toEqual(expectedObject);
    });
  });

  describe('transformHeaderData', () => {
    it('should transform header Data', () => {
      const listHeaderDTOMock: ListsSummaryDTO = getListsSummaryDTOMock();

      const actualHeaderData: ListsSummary =
        listsTransformerService.formatListsSummaryData(listHeaderDTOMock);

      expect(actualHeaderData).toEqual(jasmine.objectContaining({
        description: listHeaderDTOMock.description,
        id: listHeaderDTOMock.id,
        name: listHeaderDTOMock.name,
        numberOfAccounts: listHeaderDTOMock.numberOfAccounts,
        ownerFirstName: listHeaderDTOMock.owner.firstName,
        ownerLastName: listHeaderDTOMock.owner.lastName,
        totalOpportunities: listHeaderDTOMock.totalOpportunities,
        closedOpportunities: listHeaderDTOMock.numberOfClosedOpportunities
      }));
    });
  });

  describe('transformListPerformanceDTO', () => {
    let listPerformanceDTOMock: ListPerformanceDTO;

    beforeEach(() => {
      listPerformanceDTOMock = getListPerformanceDTOMock();
    });

    it('should transform the given ListPerformanceDTO and its child ListStorePerformanceDTO collection into'
    + ' ListPerformance and ListStorePerformance domain models', () => {
      const expectedListStorePerformanceCollection: ListStorePerformance[] = listPerformanceDTOMock.storePerformance.map(
        (listStorePerformanceDTO: ListStorePerformanceDTO) => {
          return {
            unversionedStoreId: listStorePerformanceDTO.storeSourceCode,
            current: listStorePerformanceDTO.current,
            currentSimple: listStorePerformanceDTO.currentSimple,
            yearAgo: listStorePerformanceDTO.yearAgo,
            yearAgoSimple: listStorePerformanceDTO.yearAgoSimple,
            lastSoldDate: listStorePerformanceDTO.lastSoldDate
          };
      });

      const actualListPerformance: ListPerformance = listsTransformerService.transformListPerformanceDTO(listPerformanceDTOMock);

      expect(actualListPerformance).toEqual({
        current: listPerformanceDTOMock.current,
        currentSimple: listPerformanceDTOMock.currentSimple,
        yearAgo: listPerformanceDTOMock.yearAgo,
        yearAgoSimple: listPerformanceDTOMock.yearAgoSimple,
        storePerformance: expectedListStorePerformanceCollection
      });
    });
  });

  describe('getLeaveListPayload', () => {
    it('should return a FormattedNewList given an employeeId and ListSummary with the employeeId filtered'
    + ' out of the collaboratorEmployeeIds array', () => {
      const listSummaryMock: ListsSummary = getListsSummaryMock();
      const employeeIdMock: string = sample(listSummaryMock.collaborators).employeeId;

      const actualLeaveListPayload: FormattedNewList = listsTransformerService.getLeaveListPayload(employeeIdMock, listSummaryMock);
      const expectedCollaboratorIds: string[] = listSummaryMock.collaborators
        .map((user: User) => user.employeeId)
        .filter((employeeId: string) => employeeId !== employeeIdMock);

      expect(actualLeaveListPayload).toEqual({
        description: listSummaryMock.description,
        name: listSummaryMock.name,
        type: ListType.TargetList,
        archived: listSummaryMock.archived,
        collaboratorType: CollaboratorType.CollaborateAndInvite,
        collaboratorEmployeeIds: expectedCollaboratorIds,
        category: ListCategory.Beer,
        ownerEmployeeId: listSummaryMock.ownerId
      });
    });
  });
});
