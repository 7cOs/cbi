import * as Chance from 'chance';
import { ListsSummaryDTO } from './lists-header-dto.model';

let chance = new Chance();

export function getListsSummaryDTOMock(): ListsSummaryDTO {
  return {
    archived: chance.bool(),
    category: chance.string(),
    collaboratorType: chance.string(),
    collaborators: [{
      employeeId: chance.string(),
      firstName: chance.string(),
      lastName: chance.string()
    }],
    createdOn: chance.string(),
    description: chance.string(),
    numberOfClosedOpportunities: chance.floating(),
    totalOpportunities: chance.floating(),
    id: chance.string(),
    name: chance.string(),
    numberOfAccounts: chance.floating(),
    owner: {
      employeeId: chance.string(),
      firstName: chance.string(),
      lastName: chance.string()
    },
    survey: {
      sfid: chance.string(),
      name: chance.string()
    },
    type: chance.string(),
    updatedOn: chance.string()
  };
}
