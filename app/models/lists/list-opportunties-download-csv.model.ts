import { ListStoresDownloadCSV } from './list-stores-download-csv.model';
import { OpportunityTypeLabel } from '../../enums/list-opportunities/list-opportunity-type-label.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityImpact } from '../../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityType } from '../../enums/list-opportunities/list-opportunity-type.enum';

export interface ListOpportunitiesDownloadCSV extends ListStoresDownloadCSV {
  productBrand: string;
  productSku: string;
  opportunityType: string;
  opportunityStatus: string;
  opportunityImpact: string;
}
