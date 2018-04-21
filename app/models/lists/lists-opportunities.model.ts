import { OpportunityImpact, OpportunityStatus, OpportunityType } from '../../enums/opportunity.enum';
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
    storeSourceCode: string;
    // rationale: string;
    // skuCode: string;
    // subBrandCode: string;
    // subBrandDescription: string;
}
