import { CollaboratorOwnerDetails, SurveyInfo } from './lists.model';

export interface ListHeaderInfoDTO {
  archived: boolean;
  category: string;
  collaboratorType: string;
  collaborators: Array<CollaboratorOwnerDetails>;
  createdOn: string;
  description: string;
  id: number;
  name: string;
  numberOfAccounts: number;
  owner: CollaboratorOwnerDetails;
  survey: SurveyInfo;
  type: number;
  updatedOn: string;
}
