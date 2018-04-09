import * as Chance from 'chance';
import { ListsSummary } from '../models/lists-header.model';

let chance = new Chance();

export function getListsSummaryMock(): ListsSummary {
  return {
    description: chance.string(),
    id: chance.floating(),
    archived: chance.bool(),
    closedOpportunities: chance.floating(),
    totalOpportunities: chance.floating(),
    numberOfAccounts: chance.floating(),
    name: chance.string(),
    ownerFirstName : chance.string(),
    ownerLastName : chance.string()
  };
}
