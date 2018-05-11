import { OpportunityImpact } from '../../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityType } from '../../enums/list-opportunities/list-opportunity-type.enum';

export interface ListsOpportunities {
  id: string;
  brandCode: string;
  brandDescription: string;
  skuDescription: string;
  type: OpportunityType;
  status: OpportunityStatus;
  impact: OpportunityImpact;
  currentDepletions_CYTD: number;
  yearAgoDepletions_CYTD: number;
  lastDepletionDate: string;
  unversionedStoreId: string;
  isSimpleDistribution: boolean;
  rationale: string;
}
