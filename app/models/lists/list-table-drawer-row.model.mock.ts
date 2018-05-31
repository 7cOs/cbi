import * as Chance from 'chance';
import * as moment from 'moment';

import { generateRandomSizedArray } from '../util.model';
import { getOpportunityImpactMock } from '../../enums/list-opportunities/list-opportunity-impact.enum.mock';
import { getOpportunityStatusMock } from '../../enums/list-opportunities/list-opportunity-status.enum.mock';
import { getOpportunityTypeLabelMock } from '../../enums/list-opportunities/list-opportunity-type-label.enum.mock';
import { getOpportunitySubTypeValueMock } from '../../enums/list-opportunities/list-opportunity-type-label.enum.mock';
import { ListTableDrawerRow } from './list-table-drawer-row.model';
import { getListOpportunityFeatureTypeMock } from './lists-opportunities-feature-type.model.mock';
import { getListOpportunityItemAuthorizationMock } from './lists-opportunities-item-authorization.model.mock';

const chance = new Chance();

export function getListTableDrawerRowMock(): ListTableDrawerRow {
  return {
    id: chance.string(),
    brand: chance.string(),
    skuPackage: chance.string(),
    type: getOpportunityTypeLabelMock(),
    subType: getOpportunitySubTypeValueMock(),
    status: getOpportunityStatusMock(),
    impact: getOpportunityImpactMock(),
    current: chance.floating(),
    yearAgo: chance.floating(),
    depletionDate: moment().format('MMDDYY'),
    checked: false,
    featureType: getListOpportunityFeatureTypeMock(),
    itemAuthorization: getListOpportunityItemAuthorizationMock()
  };
}

export function getListTableDrawerRowArrayMock(): ListTableDrawerRow[] {
  return generateRandomSizedArray().map(() => getListTableDrawerRowMock());
}
