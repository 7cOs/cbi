import { OpportunityImpact } from '../../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityTypeLabel } from '../../enums/list-opportunities/list-opportunity-type-label.enum';

export interface ListTableDrawerRow {
  brand: string;
  skuPackage: string;
  type: OpportunityTypeLabel;
  status: OpportunityStatus;
  impact: OpportunityImpact;
  current: number;
  yearAgo: number;
  depletionDate: string;
  checked: boolean;
}
