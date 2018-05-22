import { V2List } from './v2-list.model';

export interface ListsCollectionSummary {
  archived: V2List[];
  owned: V2List[];
  ownedNotArchivedTargetLists: V2List[];
  sharedWithMe: V2List[];
  ownedAndSharedWithMe: V2List[];

  ownedArchived: number;
  ownedNotArchived: number;
  sharedArchivedCount: number;
  sharedNotArchivedCount: number;
}
