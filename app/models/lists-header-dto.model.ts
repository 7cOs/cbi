import { Collaborators, OwnerDetails, SurveyInfo } from './lists.model';

export interface ListHeaderInfoDTO {
  archived: boolean;
  category: string;
  collaboratorType: string;
  collaborators: Array<Collaborators>;
  createdOn: string;
  description: string;
  id: number;
  name: string;
  numberOfAccounts: number;
  owner: OwnerDetails;
  survey: SurveyInfo;
  type: number;
  updatedOn: string;
}
