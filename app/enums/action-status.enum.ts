export enum ActionStatus {
  NotFetched = 'NotFetched',
  Fetching = 'Fetching',
  Fetched = 'Fetched',
  Error = 'Error',
  Deleting = 'Deleting',
  DeleteSuccess = 'DeleteSuccess'
}

export interface State {
  status: ActionStatus;
}
