import { User } from './user.model';

export interface Collaborator {
  lastViewed: string;
  permissionLevel: string;
  user: User;
}
