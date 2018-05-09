import { User } from './user.model';

export interface UnformattedNewList {
  description: string;
  name: string;
  opportunities: any[]; // typed as any because it represents opportunities as they exist in the opportunities search page
  collaborators: User[];
  targetListShares?: {id: number}[];
}
