export interface StoreDetailsRow {
  address: string;
  city: string;
  name: string;
  number: string;
  postalCode: string;
  premiseType: string;
  state: string;
  distributor: string;
  segmentCode: string;
}

export interface ListHeaderDetails {
  archived: boolean;
  description: string;
  id: number;
  name: string;
  closedOpportunities: number;
  totalOpportunities: number;
  numberOfAccounts: number;
  ownerFirstName: string;
  ownerLastName: string;
}

export interface CollaboratorOwnerDetails {
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface SurveyInfo {
  sfid: string;
  name: string;
}

export interface PrimaryDistributor {
  id: string;
  name: string;
}
