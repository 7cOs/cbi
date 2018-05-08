import { CollaboratorOwnerDetails } from './collaborator-owner-details.model';
import { SurveyInfo } from './survey-info.model';

export interface ListsSummaryDTO {
  archived: boolean;
  category: string;
  collaboratorType: string;
  collaborators: Array<CollaboratorOwnerDetails>;
  createdOn: string;
  description: string;
  id: string;
  numberOfClosedOpportunities: number;
  totalOpportunities: number;
  name: string;
  numberOfAccounts: number;
  owner: CollaboratorOwnerDetails;
  survey: SurveyInfo;
  type: number;
  updatedOn: string;
}
