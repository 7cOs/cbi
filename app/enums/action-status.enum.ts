export enum ActionStatus {
  NotFetched = <any>'NotFetched',
  Fetching = <any>'Fetching',
  Fetched = <any>'Fetched',
  Error = <any>'Error'
}

export interface State {
  status: ActionStatus;
}
