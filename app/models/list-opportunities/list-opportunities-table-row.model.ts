import { ListTableDrawerRow } from '../lists/list-table-drawer-row.model';

export interface ListOpportunitiesTableRow {
  storeColumn: string;
  storeAddressSubline: string;
  distributorColumn: string;
  segmentColumn: string;
  cytdColumn: number;
  cytdVersusYaPercentColumn: number;
  opportunitiesColumn: number;
  opportunities: ListTableDrawerRow[];
  performanceError: boolean;
  checked: boolean;
  expanded: boolean;
  storeNumber: string;
  storeCity: string;
  storeState: string;
  unversionedStoreId: string;
  distributorCustomerCode: string;
  distributorSalesperson: string;
}
