import { sample } from 'lodash';

import { OpportunityStatus } from './list-opportunity-status.enum';

const opportunityStatusValues = Object.keys(OpportunityStatus).map(key => OpportunityStatus[key]);

export function getOpportunityStatusMock(): OpportunityStatus {
    return sample(opportunityStatusValues);
}
