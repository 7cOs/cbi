import { CollaboratorOwnerDetails } from './lists.model';

export interface ListsSummary {
  archived: boolean;
  description: string;
  id: string;
  name: string;
  closedOpportunities: number;
  totalOpportunities: number;
  numberOfAccounts: number;
  ownerFirstName: string;
  ownerLastName: string;
  collaborators: Array<CollaboratorOwnerDetails>;
  ownerId: string;
  type: number;
  collaboratorType: string;
  category: string;
}
