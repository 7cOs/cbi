import { BaseList } from './base-list.model';
import { OpportunitiesSummary } from './opportunities-summary.model';

export interface V2List extends BaseList {
  collaboratorPermissionLevel: string;
  opportunitiesSummary: OpportunitiesSummary;
  dateOpportunitiesUpdated?: string;
  targetListAuthor?: string;
}
