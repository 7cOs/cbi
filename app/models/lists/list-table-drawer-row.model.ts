import { OpportunityImpact } from '../../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityType } from '../../enums/list-opportunities/list-opportunity-type.enum';
import { OpportunityTypeLabel } from '../../enums/list-opportunities/list-opportunity-type-label.enum';
import { OpportunityFeatureType } from './lists-opportunities-feature-type.model';
import { OpportunityItemAuthorization } from './lists-opportunities-item-authorization.model';

export interface ListTableDrawerRow {
  id: string;
  brand: string;
  skuPackage: string;
  type: OpportunityTypeLabel | OpportunityType;
  subType: string;
  status: OpportunityStatus;
  impact: OpportunityImpact;
  current: number;
  yearAgo: number;
  depletionDate: string;
  checked: boolean;
  featureType: OpportunityFeatureType;
  itemAuthorization: OpportunityItemAuthorization;
}
