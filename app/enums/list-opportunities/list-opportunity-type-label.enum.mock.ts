import { sample } from 'lodash';

import { OpportunityTypeLabel } from './list-opportunity-type-label.enum';

const opportunityTypeLabelValues = Object.keys(OpportunityTypeLabel).map(key => OpportunityTypeLabel[key]);

export function getOpportunityTypeLabelMock(): OpportunityTypeLabel {
    return sample(opportunityTypeLabelValues);
}
