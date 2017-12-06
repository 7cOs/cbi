export interface OpportunityCountDTO {
  type: string;
  label: string;
  count: number;
  items?: Array<OpportunityCountDTO>;
}
