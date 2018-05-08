import { Collaborator } from './collaborator.model';
import { SurveyInfo } from './survey-info.model';
import { User } from './user.model';

export interface BaseList {
  archived: boolean;
  collaborators: Collaborator[];
  createdOn: string;
  deleted: boolean;
  description: string;
  id: string;
  name: string;
  numberOfAccounts: number;
  numberOfClosedOpportunities: number;
  owner: User;
  survey: SurveyInfo;
  totalOpportunities: number;
  type: string;
  updatedOn: string;
}
