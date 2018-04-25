import { sample } from 'lodash';

import { OpportunityType } from './list-opportunity-type.enum';

const opportunityTypeValues = Object.keys(OpportunityType).map(key => OpportunityType[key]);

export function getOpportunityTypeMock(): OpportunityType {
    return sample(opportunityTypeValues);
}
