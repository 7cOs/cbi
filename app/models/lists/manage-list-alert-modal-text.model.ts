import { CompassManageListModalEvent } from '../../enums/compass-manage-list-modal-event.enum';

export const MANAGE_LIST_ALERT_MODAL_TEXT = {
  [CompassManageListModalEvent.Delete]: {
    body: 'Deleting a list cannot be undone. You’ll lose all list store performance and opportunity progress.',
    acceptLabel: 'DELETE'
  },
  [CompassManageListModalEvent.Archive]: {
    body: `Are you sure you want to archive this list?`,
    acceptLabel: 'ARCHIVE'
  },
  [CompassManageListModalEvent.Leave]: {
    body: `Are you sure you want to leave this list?`,
    acceptLabel: 'LEAVE'
  },
  [CompassManageListModalEvent.Transfer_Ownership]: {
    body: 'Are you sure you want to transfer ownership over this list? You will become a collaborator on this list.',
    acceptLabel: 'Transfer Ownership'
  }
};
