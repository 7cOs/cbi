import { OpportunityImpact } from '../../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityType } from '../../enums/list-opportunities/list-opportunity-type.enum';

export interface ListOpportunityDTO {
    brandCode: string;
    brandDescription: string;
    currentDepletions_CYTD: number;
    id: string;
    impact: OpportunityImpact;
    lastDepletionDate: string;
    rationale: string;
    skuCode: string;
    skuDescription: string;
    status: OpportunityStatus;
    storeSourceCode: string;
    subBrandCode: string;
    subBrandDescription: string;
    type: OpportunityType;
    yearAgoDepletions_CYTD: number;
    isSimpleDistributionOpportunity: boolean;
}
