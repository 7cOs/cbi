import * as Chance from 'chance';

import { CollaboratorOwnerDetails } from './collaborator-owner-details.model';
import { generateRandomSizedArray } from '../util.model';

const chance = new Chance();

export function getCollaboratorOwnerDetailsMock(): CollaboratorOwnerDetails {
  return {
    employeeId: chance.string(),
    firstName: chance.string(),
    lastName: chance.string()
  };
}

export function getCollaboratorOwnerDetailsArrayMock(): CollaboratorOwnerDetails[] {
  return generateRandomSizedArray().map(() => getCollaboratorOwnerDetailsMock());
}
