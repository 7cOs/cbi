import { OpportunityItemAuthorization } from './lists-opportunities-item-authorization.model';

export function getListOpportunityItemAuthorizationMock(): OpportunityItemAuthorization {
  return {
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
