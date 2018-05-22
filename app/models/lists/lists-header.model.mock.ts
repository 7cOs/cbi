import * as Chance from 'chance';

import { getCollaboratorOwnerDetailsArrayMock } from './collaborator-owner-details.model.mock';
import { ListsSummary } from '../../models/lists/lists-header.model';

const chance = new Chance();

export function getListsSummaryMock(): ListsSummary {
  return {
    description: chance.string(),
    id: chance.string(),
    archived: chance.bool(),
    closedOpportunities: chance.floating(),
    totalOpportunities: chance.floating(),
    numberOfAccounts: chance.floating(),
    name: chance.string(),
    ownerFirstName : chance.string(),
    ownerLastName : chance.string(),
    collaborators: getCollaboratorOwnerDetailsArrayMock(),
    ownerId: chance.string(),
    type: chance.string(),
    collaboratorType: chance.string(),
    category: chance.string()
  };
}
