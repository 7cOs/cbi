export enum ActionStatus {
  NotFetched,
  Fetching,
  Fetched,
  Error
}

export interface State {
  status?: ActionStatus;
}
