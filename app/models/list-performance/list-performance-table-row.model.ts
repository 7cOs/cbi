export interface ListPerformanceTableRow {
  storeColumn: string;
  storeAddressSubline: string;
  distributorColumn: string;
  segmentColumn: string;
  cytdColumn: number;
  cytdVersusYaColumn: number;
  cytdVersusYaPercentColumn: number;
  l90Column: number;
  l90VersusYaColumn: number;
  l90VersusYaPercentColumn: number;
  lastDepletionDateColumn: string;
  performanceError: boolean;
  checked: boolean;
  storeNumber: string;
  storeCity: string;
  storeState: string;
  unversionedStoreId: string;
  distributorCustomerCode: string;
  distributorSalesperson: string;
}
