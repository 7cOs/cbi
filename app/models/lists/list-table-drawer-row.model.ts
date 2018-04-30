import { OpportunityImpact } from '../../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityStatusLabel } from '../../enums/list-opportunities/list-opportunity-status-label.enum';
import { OpportunityTypeLabel } from '../../enums/list-opportunities/list-opportunity-type-label.enum';

// TODO: OPP MANDATE
export interface ListTableDrawerRow {
  brand: string;
  skuPackage: string;
  type: OpportunityTypeLabel;
  status: OpportunityStatusLabel;
  impact: OpportunityImpact;
  current: number;
  yearAgo: number;
  depletionDate: string;
  checked: boolean;
}
