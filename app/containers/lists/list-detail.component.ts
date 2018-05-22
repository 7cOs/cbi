import * as moment from 'moment';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';

import { ActionButtonType } from '../../enums/action-button-type.enum';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { CompassActionModalOutputs } from '../../models/compass-action-modal-outputs.model';
import { CompassManageListModalEvent } from '../../enums/compass-manage-list-modal-event.enum';
import { CompassManageListModalOutput } from '../../models/compass-manage-list-modal-output.model';
import { CompassManageListModalOverlayRef } from '../../shared/components/compass-manage-list-modal/compass-manage-list-modal.overlayref';
import { CompassModalService } from '../../services/compass-modal.service';
import { CompassSelectOption } from '../../models/compass-select-component.model';
import { CompassActionModalEvent } from '../../enums/compass-action-modal-event.enum';
import { CompassActionModalInputs } from '../../models/compass-action-modal-inputs.model';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { RadioInputModel } from '../../models/compass-radio-input.model';
import * as ListsActions from '../../state/actions//lists.action';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListsDownloadType } from '../../enums/lists/list-download-type.enum';
import { ListOpportunitiesColumnType } from '../../enums/list-opportunities-column-types.enum';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { listOpportunityStatusOptions } from '../../models/list-opportunities/list-opportunity-status-options.model';
import { ListPerformanceColumnType } from '../../enums/list-performance-column-types.enum';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import { ListsState } from '../../state/reducers/lists.reducer';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { ListStoresDownloadCSV } from '../../models/lists/list-stores-download-csv.model';
import { ListOpportunitiesDownloadCSV } from '../../models/lists/list-opportunities-download-csv.model';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { ListTableDrawerRow } from '../../models/lists/list-table-drawer-row.model';
import { LIST_TABLE_SIZE } from '../../shared/components/lists-pagination/lists-pagination.component';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { User } from '../../models/lists/user.model';
import { OpportunitiesByStore } from '../../models/lists/opportunities-by-store.model';
import { OpportunityTypeLabel } from '../../enums/list-opportunities/list-opportunity-type-label.enum';

interface ListPageClick {
  pageNumber: number;
}

export interface PageChangeData {
  pageStart: number;
  pageEnd: number;
}

export const downloadRadioOptions: Array<CompassSelectOption> = [{
  display: 'Stores Only',
  value: ListsDownloadType.Stores
}, {
  display: 'Opportunities',
  value: ListsDownloadType.Opportunities
}];

export const SIMPLE_OPPORTUNITY_SKU_PACKAGE_LABEL: string = 'ANY';

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {
  paginationReset: Subject<Event> = new Subject();
  sortReset: Subject<Event> = new Subject();

  public listSummary: ListsSummary;
  public performanceTabTitle: string = 'Performance';
  public opportunitiesTabTitle: string = 'Opportunities';
  public actionButtonType: any = ActionButtonType;
  public filteredOpportunitiesTableData: ListOpportunitiesTableRow[];
  public opportunityStatusOptions: Array<CompassSelectOption> = [];
  public oppStatusSelected: OpportunityStatus;
  public performanceTableHeader: string[] = ['Store', 'Distributor', 'Segment', 'Depletions', ' Effective POD', 'Last Depletion'];
  public performanceTableTotal: ListPerformanceTableRow;
  public performanceTableData: ListPerformanceTableRow[];
  public opportunitiesTableDataSize: number;
  public opportunitiesTableHeader: string[] = ['Store', 'Distributor', 'Segment', 'Depletions', ' Opportunities', 'Last Depletion'];
  public compassModalOverlayRef: CompassManageListModalOverlayRef;
  public currentUser: User;
  public opportunitiesTableData: ListOpportunitiesTableRow[];
  public performanceTableDataSize: number;
  public listTableSize: number = LIST_TABLE_SIZE;
  public pageChangeData: PageChangeData;
  public performanceSortingCriteria: Array<SortingCriteria> = [{
    columnType: ListPerformanceColumnType.cytdColumn,
    ascending: false
  }];
  public opportunitiesSortingCriteria: Array<SortingCriteria> = [{
    columnType: ListOpportunitiesColumnType.cytdColumn,
    ascending: false
  }];
  public selectedTab: string = this.performanceTabTitle;
  public activeTab: string = this.performanceTabTitle;
  public showManageListLoader: boolean = false;
  public downloadAllModalStringInputs: CompassActionModalInputs;
  public compassAlertModalAccept = CompassActionModalEvent.Accept;
  public radioInputModel: RadioInputModel = {
    selected: ListsDownloadType.Stores,
    radioOptions: downloadRadioOptions,
    title: 'OPTIONS',
    stacked: false
  };
  public totalOppsForList: number;
  public isOppsTabDataFetched: boolean = false;
  public isPerformanceTabDataFetched: boolean = false;
  public downloadBodyHTML: string;
  public groupedOppsByStore: OpportunitiesByStore;

  private listDetailSubscription: Subscription;

  constructor(
    private compassModalService: CompassModalService,
    private listsTableTransformerService: ListsTableTransformerService,
    @Inject('$state') private $state: any,
    private store: Store<AppState>,
    private titleService: Title,
    private numberPipe: DecimalPipe,
    private upperCasePipe: UpperCasePipe,
    @Inject('userService') private userService: any
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
    this.currentUser = {
      employeeId: this.userService.model.currentUser.employeeID,
      firstName: this.userService.model.currentUser.firstName,
      lastName: this.userService.model.currentUser.lastName
    };
    this.opportunityStatusOptions = listOpportunityStatusOptions;
    this.oppStatusSelected = OpportunityStatus.all;

    this.store.dispatch(new ListsActions.FetchStoreDetails({listId: this.$state.params.id}));
    this.store.dispatch(new ListsActions.FetchHeaderDetails({listId: this.$state.params.id}));
    this.store.dispatch(new ListsActions.FetchOppsForList({listId: this.$state.params.id}));
    this.store.dispatch(new ListsActions.FetchListPerformanceVolume({
      listId: this.$state.params.id,
      performanceType: ListPerformanceType.Volume,
      beverageType: ListBeverageType.Beer,
      dateRangeCode: DateRangeTimePeriodValue.CYTDBDL
    }));
    this.store.dispatch(new ListsActions.FetchListPerformancePOD({
      listId: this.$state.params.id,
      performanceType: ListPerformanceType.POD,
      beverageType: ListBeverageType.Beer,
      dateRangeCode: DateRangeTimePeriodValue.L90BDL
    }));

    this.listDetailSubscription = this.store
      .select(state => state.listsDetails)
      .subscribe((listDetail: ListsState)  => {
        this.listSummary = listDetail.listSummary.summaryData;
        if (this.isListPerformanceFetched(
          listDetail.listStores.storeStatus,
          listDetail.performance.volumeStatus,
          listDetail.performance.podStatus
        )) {
          this.performanceTableTotal = this.listsTableTransformerService.transformPerformanceTotal(
            listDetail.performance.volume,
            listDetail.performance.pod
          );
          this.performanceTableData = this.listsTableTransformerService.transformPerformanceCollection(
            listDetail.listStores.stores,
            listDetail.performance.volume.storePerformance,
            listDetail.performance.pod.storePerformance
          );
          this.performanceTableDataSize = this.performanceTableData.length;
          if (!this.performanceTableDataSize) this.isPerformanceTabDataFetched = false; else this.isPerformanceTabDataFetched = true;
        }

        if (this.isListOpportunitiesFetched(
          listDetail.listStores.storeStatus,
          listDetail.performance.volumeStatus,
          listDetail.listOpportunities.opportunitiesStatus
        )) {
          this.groupedOppsByStore = listDetail.listOpportunities.opportunities;
          this.opportunitiesTableData = this.listsTableTransformerService.transformOpportunitiesCollection(
            listDetail.listStores.stores,
            listDetail.performance.volume.storePerformance,
            listDetail.listOpportunities.opportunities
          );
          this.filteredOpportunitiesTableData = this.oppStatusSelected === OpportunityStatus.all ?
            this.opportunitiesTableData : this.filterOpportunitiesByStatus(
              this.oppStatusSelected,
              this.opportunitiesTableData
            );
          this.totalOppsForList = this.getCumulativeOppsForList(this.filteredOpportunitiesTableData);
          this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
          if (!this.opportunitiesTableDataSize) this.isOppsTabDataFetched = false; else this.isOppsTabDataFetched = true;
        }
        if (listDetail.manageListStatus !== ActionStatus.NotFetched) {
          this.handleManageListStatus(listDetail.manageListStatus);
        }
      });
  }

  downloadActionButtonClicked() {
    let numStores = 0;
    if (this.selectedTab === this.performanceTabTitle) {
      numStores = this.performanceTableDataSize;
    } else {
      numStores = this.opportunitiesTableDataSize;
    }

    this.downloadBodyHTML = '<b> CURRENT DOWNLOAD CONTAINS </b> <br/> <br/> <b>' +
      this.totalOppsForList + ' opportunities </b> across ' + numStores + ' stores </div>';
    this.downloadAllModalStringInputs = {
      'title': 'Download',
      'bodyText': this.downloadBodyHTML,
      'radioInputModel': this.radioInputModel,
      'acceptLabel': 'Download',
      'rejectLabel': 'Cancel'
    };
    let compassModalOverlayRef = this.compassModalService.showActionModalDialog(this.downloadAllModalStringInputs, null);
    this.compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value: any) => {
        const csvDownloadData = this.modalDownloadClicked(value);
        this.generateCSVForDownload(value, csvDownloadData);
    });
  }

  opportunityStatusSelected(statusValue: OpportunityStatus) {
    this.oppStatusSelected = statusValue;
    this.filteredOpportunitiesTableData = this.oppStatusSelected === OpportunityStatus.all ?
      this.opportunitiesTableData : this.filterOpportunitiesByStatus(
        this.oppStatusSelected,
        this.opportunitiesTableData
      );
    this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
    if (!this.opportunitiesTableDataSize) this.isOppsTabDataFetched = false; else this.isOppsTabDataFetched = true;
    this.totalOppsForList = this.getCumulativeOppsForList(this.filteredOpportunitiesTableData);
    this.paginationReset.next();
  }

  filterOpportunitiesByStatus(status: OpportunityStatus, oppsTableData: ListOpportunitiesTableRow[]): ListOpportunitiesTableRow[] {
    const filterOpportunities = (opportunityRows: ListTableDrawerRow[]) => {
      return opportunityRows.filter((opp: ListTableDrawerRow) => {
        return status === OpportunityStatus.targeted ?
          opp.status === OpportunityStatus.targeted
          || opp.status === OpportunityStatus.inactive : opp.status === OpportunityStatus.closed;
      });
    };

    return oppsTableData.reduce((accumulatedStoreRows: ListOpportunitiesTableRow[], storeRow: ListOpportunitiesTableRow) => {
      const storeRowFiltered = Object.assign({}, storeRow, {
        opportunities: filterOpportunities(storeRow.opportunities)
      });
      if (storeRowFiltered.opportunities.length) {
        storeRowFiltered.opportunitiesColumn = storeRowFiltered.opportunities.length;
        accumulatedStoreRows.push(storeRowFiltered);
      }
      return accumulatedStoreRows;
    }, []);
  }

  ngOnDestroy() {
    this.listDetailSubscription.unsubscribe();
  }

  public handlePageClick(event: ListPageClick) {
    const pageNumber = event.pageNumber;
    let pageStart = ((pageNumber - 1 ) * LIST_TABLE_SIZE);
    let pageEnd = (pageNumber * LIST_TABLE_SIZE) ;
    this.pageChangeData = {pageStart: pageStart, pageEnd: pageEnd};
  }

  public handleManageButtonClick() {
    const manageModalRef: CompassManageListModalOverlayRef = this.compassModalService.showManageListModalDialog({
      title: 'Manage List',
      acceptLabel: 'Save',
      rejectLabel: 'CANCEL',
      currentUser: this.currentUser,
      listObject: this.listSummary
    }, {});

    manageModalRef.modalInstance.buttonContainerEvent.subscribe((manageModalData: CompassManageListModalOutput) => {
      this.handleManageModalEvent(manageModalData);
    });
  }

  public handleListsLinkClick() {
    this.$state.go('lists');
  }

  public onTabClicked(tabName: string): void {
    this.selectedTab = tabName;
    if (tabName !== this.activeTab) {
      this.activeTab = tabName;
      this.paginationReset.next();
      this.sortReset.next();
    }
    if (tabName === this.performanceTabTitle) {
      this.opportunitiesTableData = this.getDeselectedOpportunitiesTableData(this.opportunitiesTableData);
      this.oppStatusSelected = listOpportunityStatusOptions.find(status => status.value === OpportunityStatus.all).value;
      this.filteredOpportunitiesTableData = this.opportunitiesTableData;
      this.opportunitiesTableDataSize = this.filteredOpportunitiesTableData.length;
      this.totalOppsForList = this.getCumulativeOppsForList(this.filteredOpportunitiesTableData);
    }
    if (tabName === this.opportunitiesTabTitle) {
      this.performanceTableData = this.getDeselectedPerformanceTableData(this.performanceTableData);
    }
  }

  public handlePaginationReset() {
    this.paginationReset.next();
  }

  public handleManageModalEvent(manageModalData: CompassManageListModalOutput): void {
    switch (manageModalData.type) {
      case CompassManageListModalEvent.Save:
        this.store.dispatch(new ListsActions.PatchList(manageModalData.listSummary));
        break;
      case CompassManageListModalEvent.Delete:
        this.store.dispatch(new ListsActions.DeleteList(manageModalData.listSummary.id));
        break;
      case CompassManageListModalEvent.Archive:
        this.store.dispatch(new ListsActions.ArchiveList(manageModalData.listSummary));
        break;
      case CompassManageListModalEvent.Leave:
        this.store.dispatch(new ListsActions.LeaveList({
          currentUserEmployeeId: this.currentUser.employeeId,
          listSummary: manageModalData.listSummary
        }));
        break;
      default:
        throw new Error(`[handleManageModalEvent]: CompassManageListModalEvent of ${ manageModalData.type } is not supported`);
    }
  }

  public handleManageListStatus(manageListStatus: ActionStatus): void {
    this.showManageListLoader = manageListStatus === ActionStatus.Fetching;

    if (manageListStatus === ActionStatus.Fetched) this.$state.go('lists');
  }

  public modalDownloadClicked(value: CompassActionModalOutputs): Array<ListStoresDownloadCSV | ListOpportunitiesDownloadCSV> {
    let exportData: Array<ListPerformanceTableRow | ListOpportunitiesTableRow>;
    if (this.selectedTab === this.performanceTabTitle) {
      exportData = this.performanceTableData;
    } else {
      exportData = this.filteredOpportunitiesTableData;
    }

    if (value.radioOptionSelected === ListsDownloadType.Stores) {
      return exportData.reduce(
        (csvData: Array<ListStoresDownloadCSV>, store: ListPerformanceTableRow) => {
          csvData.push({
            distributor: store.distributorColumn,
            storeName: store.storeColumn,
            storeNumber: store.storeNumber === 'UNKNOWN' ? '' : store.storeNumber,
            address: store.storeAddressSubline,
            city: store.storeCity,
            state: store.storeState,
            cytdVolume: Math.round(store.cytdColumn),
            cytdVsYaPercentage: `${this.numberPipe.transform(store.cytdVersusYaPercentColumn, '1.1-1')}%`,
            segmentCode: store.segmentColumn
          });
          return csvData;
      }, []);
    } else {
      return exportData.reduce(
        (csvData: Array<ListOpportunitiesDownloadCSV>, store: ListOpportunitiesTableRow) => {
          const oppsForStore: ListsOpportunities[] = this.groupedOppsByStore[store.unversionedStoreId];
          if (!oppsForStore) {
            csvData.push({
              distributor: store.distributorColumn,
              storeName: store.storeColumn,
              storeNumber: store.storeNumber === 'UNKNOWN' ? '' : store.storeNumber,
              address: store.storeAddressSubline,
              city: store.storeCity,
              state: store.storeState,
              cytdVolume: Math.round(store.cytdColumn),
              cytdVsYaPercentage: `${this.numberPipe.transform(store.cytdVersusYaPercentColumn, '1.1-1')}%`,
              segmentCode: store.segmentColumn,
              productBrand: '',
              productSku: '',
              opportunityStatus: '',
              opportunityType: '',
              opportunityImpact: ''
            });
          } else {
            const filteredOpportunities = (opportunityRows: ListsOpportunities[]): ListsOpportunities[] => {
              return opportunityRows.filter((opp: ListsOpportunities) => {
                return this.oppStatusSelected === OpportunityStatus.targeted ?
                  opp.status === OpportunityStatus.targeted
                  || opp.status === OpportunityStatus.inactive : opp.status === OpportunityStatus.closed;
              });
            };
            const oppsForCSV: ListsOpportunities[] = this.oppStatusSelected === OpportunityStatus.all
              ? oppsForStore
              : filteredOpportunities(oppsForStore);
            oppsForCSV.forEach((opportunity: ListsOpportunities) => {
              csvData.push({
                distributor: store.distributorColumn,
                storeName: store.storeColumn,
                storeNumber: store.storeNumber === 'UNKNOWN' ? '' : store.storeNumber,
                address: store.storeAddressSubline,
                city: store.storeCity,
                state: store.storeState,
                cytdVolume: Math.round(store.cytdColumn),
                cytdVsYaPercentage: `${this.numberPipe.transform(store.cytdVersusYaPercentColumn, '1.1-1')}%`,
                segmentCode: store.segmentColumn,
                productBrand: opportunity.brandDescription,
                productSku: opportunity.isSimpleDistribution ? SIMPLE_OPPORTUNITY_SKU_PACKAGE_LABEL : opportunity.skuDescription,
                opportunityStatus: this.upperCasePipe.transform(opportunity.status) || '',
                opportunityType: OpportunityTypeLabel[opportunity.type] || opportunity.type,
                opportunityImpact: this.upperCasePipe.transform(opportunity.impact) || ''
              });
            });
          }
          return csvData;
      }, []);
    }
  }

  private isListPerformanceFetched(
    storeStatus: ActionStatus,
    volumePerformanceStatus: ActionStatus,
    podPerformanceStatus: ActionStatus
  ): boolean {
    return storeStatus === ActionStatus.Fetched
      && volumePerformanceStatus === ActionStatus.Fetched
      && podPerformanceStatus === ActionStatus.Fetched;
  }

  private isListOpportunitiesFetched(
    storeStatus: ActionStatus,
    volumePerformanceStatus: ActionStatus,
    opportunitiesStatus: ActionStatus
  ): boolean {
    return storeStatus === ActionStatus.Fetched
      && volumePerformanceStatus === ActionStatus.Fetched
      && opportunitiesStatus === ActionStatus.Fetched;
  }

  private getDeselectedPerformanceTableData(performanceTableData: ListPerformanceTableRow[]): ListPerformanceTableRow[] {
    return performanceTableData.map((tableRow: ListPerformanceTableRow) => {
      return Object.assign({}, tableRow, {
        checked: false
      });
    });
  }

  private getDeselectedOpportunitiesTableData(opportunitiesTableData: ListOpportunitiesTableRow[]): ListOpportunitiesTableRow[] {
    const clearTableDrawerSelections = (opportunityRows: ListTableDrawerRow[]): ListTableDrawerRow[] => {
      return opportunityRows.map((opportunityRow: ListTableDrawerRow) => {
        return Object.assign({}, opportunityRow, {
          checked: false
        });
      });
    };

    return opportunitiesTableData.map((tableRow: ListOpportunitiesTableRow) => {
      return Object.assign({}, tableRow, {
        opportunities: clearTableDrawerSelections(tableRow.opportunities),
        checked: false,
        expanded: false
      });
    });
  }

  private getCumulativeOppsForList(oppsData: ListOpportunitiesTableRow[]): number {
    let cumulativeOppsCount: number = 0;
    oppsData.map((eachStore: ListOpportunitiesTableRow) => {
      cumulativeOppsCount += eachStore.opportunities.length;
    });
    return cumulativeOppsCount;
  }

  private generateCSVForDownload(
    value: CompassActionModalOutputs,
    csvDownloadData: Array<ListStoresDownloadCSV | ListOpportunitiesDownloadCSV>) {
      const storesHeader = [
        'Distributor',
        'Store Name',
        'Store Number',
        'Address',
        'City',
        'State',
        'CYTD Volume',
        'vs YA %',
        'Segment'
      ];
      let oppsHeader = [...storesHeader];
      oppsHeader.push.apply(oppsHeader, [
        'Product Brand',
        'Product Sku',
        'Opportunity Status',
        'Opportunity Type',
        'Opportunity Predicted Impact'
      ]);
      const csvHeaders = value.radioOptionSelected === ListsDownloadType.Stores ? storesHeader : oppsHeader;
      const csvTitle = value.radioOptionSelected === ListsDownloadType.Stores
        ? `${moment().format('YYYY-MM-DD')}${ListsDownloadType.Stores}`
        : `${moment().format('YYYY-MM-DD')}${ListsDownloadType.Opportunities}`;
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: true,
        noDownload: false,
        headers: csvHeaders
      };
      const csvObj = new Angular5Csv(csvDownloadData, csvTitle, options);
      csvObj.fileName = csvTitle;
  }
}
