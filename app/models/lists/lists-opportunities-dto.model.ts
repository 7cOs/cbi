import { OpportunityImpact, OpportunityStatus, OpportunityType } from '../../enums/opportunity.enum';
export interface ListOpportunitiesDTO {
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
    // TO DO - Add isSimpleDistributionOpportunity once it becomes available - story up for including this field for Ryan's Team
}
