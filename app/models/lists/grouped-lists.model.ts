import { V3List } from './v3-list.model';

export interface GroupedLists {
  owned: V3List[];
  archived: V3List[];
  sharedWithMe: V3List[];
}
