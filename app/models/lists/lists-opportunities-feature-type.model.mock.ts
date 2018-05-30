import { OpportunityFeatureType } from './lists-opportunities-feature-type.model';

export function getListOpportunityFeatureTypeMock(): OpportunityFeatureType {
  return {
    featureTypeCode: chance.string(),
    featureTypeDescription: chance.string(),
    featurePeriodBeginDate: chance.string(),
    featurePeriodEndDate: chance.string(),
    featureResetBeginDate: chance.string(),
    featureResetEndDate: chance.string(),
    featurePrice: chance.string(),
    featureIsOnMenu: chance.string(),
    featureNotes: chance.string()
  };
}
