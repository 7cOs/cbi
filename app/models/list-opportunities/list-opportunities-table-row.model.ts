import { ListTableDrawerRow } from '../lists/list-table-drawer-row.model';

// TODO: MAKE OPPS REQUIRED
export interface ListOpportunitiesTableRow {
  storeColumn: string;
  storeAddressSubline: string;
  distributorColumn: string;
  segmentColumn: string;
  cytdColumn: number;
  cytdVersusYaPercentColumn: number;
  opportunitiesColumn: number;
  opportunities?: ListTableDrawerRow[];
  performanceError: boolean;
  checked: boolean;
  expanded: boolean;
  unversionedStoreId: string;
}
