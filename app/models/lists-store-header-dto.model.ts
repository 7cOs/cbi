import { Collaborators, Owner, Survey } from './lists.model';

export interface StoreHeaderInfoDTO {
  archived: boolean;
  category: string;
  collaboratorType: string;
  collaborators: Array<Collaborators>;
  createdOn: string;
  description: string;
  id: number;
  name: string;
  numberOfAccounts: number;
  owner: Owner;
  survey: Survey;
  type: number;
  updatedOn: string;
}
