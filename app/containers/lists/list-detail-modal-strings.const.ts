
import { CompassAlertModalInputs } from '../../models/compass-alert-modal-inputs.model';

export const REMOVE_STORE_MODAL_CONFIG: CompassAlertModalInputs = {
  'title': 'Are you sure?',
  'body': 'Removing the stores from a list will remove all store performance and opportunities associated with the stores.',
  'rejectLabel': 'Cancel',
  'acceptLabel': 'Remove'
};

export const REMOVE_OPPS_MODAL_CONFIG: CompassAlertModalInputs = {
  'title': 'Are you sure?',
  'body': 'Removing the opportunities from a list cannot be undone. Store performance will still be available.',
  'rejectLabel': 'Cancel',
  'acceptLabel': 'Remove'
};
