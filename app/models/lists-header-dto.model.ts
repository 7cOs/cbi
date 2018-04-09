import { CollaboratorOwnerDetails, SurveyInfo } from './lists.model';

export interface ListsSummaryDTO {
  archived: boolean;
  category: string;
  collaboratorType: string;
  collaborators: Array<CollaboratorOwnerDetails>;
  createdOn: string;
  description: string;
  id: number;
  numberOfClosedOpportunities: number;
  totalOpportunities: number;
  name: string;
  numberOfAccounts: number;
  owner: CollaboratorOwnerDetails;
  survey: SurveyInfo;
  type: number;
  updatedOn: string;
}
