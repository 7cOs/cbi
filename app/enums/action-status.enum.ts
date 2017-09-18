export enum ActionStatus {
  NotFetched = 'NotFetched',
  Fetching   = 'Fetching',
  Fetched    = 'Fetched',
  Error      = 'Error'
}

export interface State {
  status: ActionStatus;
}
