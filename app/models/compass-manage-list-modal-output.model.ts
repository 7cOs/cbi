import { CompassManageListModalEvent } from '../enums/compass-manage-list-modal-event.enum';
import { ListsSummary } from './lists/lists-header.model';

export interface CompassManageListModalOutput {
  listSummary: ListsSummary;
  type: CompassManageListModalEvent;
}
