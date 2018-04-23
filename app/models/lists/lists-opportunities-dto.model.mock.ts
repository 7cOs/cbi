import * as Chance from 'chance';
import { generateRandomSizedArray } from '../util.model';

import { ListOpportunitiesDTO } from './lists-opportunities-dto.model';
import { getOpportunityImpactMock, getOpportunityStatusMock, getOpportunityTypeMock } from '../../enums/opportunity.enum.mock';

let chance = new Chance();

export function getListOpportunitiesDTOMock(): ListOpportunitiesDTO[] {
    return generateRandomSizedArray(1, 3).map(() => getListOpportunityDTOMock());
}

export function getListOpportunityDTOMock(): ListOpportunitiesDTO {
    return {
        brandCode: chance.string(),
        brandDescription: chance.string(),
        currentDepletions_CYTD: chance.natural(),
        id: chance.string(),
        impact: getOpportunityImpactMock(),
        lastDepletionDate: chance.string(),
        rationale: chance.string(),
        skuCode: chance.string(),
        skuDescription: chance.string(),
        status: getOpportunityStatusMock(),
        storeSourceCode: chance.string(),
        subBrandCode: chance.string(),
        subBrandDescription: chance.string(),
        type: getOpportunityTypeMock(),
        yearAgoDepletions_CYTD: chance.natural(),
        isSimpleDistributionOpportunity: chance.bool()
    };
}
