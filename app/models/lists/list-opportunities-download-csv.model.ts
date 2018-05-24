import { ListStoresDownloadCSV } from './list-stores-download-csv.model';

export interface ListOpportunitiesDownloadCSV extends ListStoresDownloadCSV {
  productBrand: string;
  productSku: string;
  opportunityType: string;
  opportunityStatus: string;
  opportunityImpact: string;
}
