import { ListsSummary } from './lists/lists-header.model';
import { User } from './lists/user.model';

export interface CompassManageListModalInputs {
  title: string;
  acceptLabel: string;
  rejectLabel: string;
  currentUser: User;
  listObject: ListsSummary;
}
