import * as Chance from 'chance';
import { generateRandomSizedArray } from '../util.model';
import * as moment from 'moment';

import { ListOpportunityDTO } from './lists-opportunities-dto.model';
import { getOpportunityTypeMock } from '../../enums/list-opportunities/list-opportunity-type.enum.mock';
import { getOpportunityStatusMock } from '../../enums/list-opportunities/list-opportunity-status.enum.mock';
import { getOpportunityImpactMock } from '../../enums/list-opportunities/list-opportunity-impact.enum.mock';
import { getOpportunitySubTypeValueMock } from '../../enums/list-opportunities/list-opportunity-type-label.enum.mock';

let chance = new Chance();

export function getListOpportunitiesDTOMock(): ListOpportunityDTO[] {
  return generateRandomSizedArray().map(() => getListOpportunityDTOMock());
}

export function getListOpportunityDTOMock(): ListOpportunityDTO {
  return {
    brandCode: chance.string(),
    brandDescription: chance.string(),
    currentDepletions_CYTD: chance.natural(),
    id: chance.string(),
    impact: getOpportunityImpactMock(),
    lastDepletionDate: moment().format('YYYYMMDD'),
    rationale: chance.string(),
    skuCode: chance.string(),
    skuDescription: chance.string(),
    status: getOpportunityStatusMock(),
    storeSourceCode: chance.string(),
    subBrandCode: chance.string(),
    subBrandDescription: chance.string(),
    type: getOpportunityTypeMock(),
    subType: getOpportunitySubTypeValueMock(),
    yearAgoDepletions_CYTD: chance.natural(),
    isSimpleDistributionOpportunity: chance.bool(),
    featureTypeCode: chance.string(),
    featureTypeDescription: chance.string(),
    featurePeriodBeginDate: chance.string(),
    featurePeriodEndDate: chance.string(),
    featureResetBeginDate: chance.string(),
    featureResetEndDate: chance.string(),
    featurePrice: chance.string(),
    featureIsOnMenu: chance.string(),
    featureNotes: chance.string(),
    itemAuthorizationCode: chance.string(),
    itemAuthorizationDescription: chance.string(),
    itemAuthorizationPeriodBeginDate: chance.string(),
    itemAuthorizationPeriodEndDate: chance.string(),
    itemAuthorizationResetBeginDate: chance.string(),
    itemAuthorizationResetEndDate: chance.string(),
    itemAuthorizationPrice: chance.string(),
    itemAuthorizationIsOnMenu: chance.string(),
    itemAuthorizationNotes: chance.string()
  };
}
