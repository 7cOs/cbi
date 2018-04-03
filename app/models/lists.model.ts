export interface StoreDetailsRow {
  address: string;
  city: string;
  name: string;
  number: string;
  postalCode: string;
  premiseType: string;
  state: string;
}

export interface ListHeaderDetails {
  description: string;
  id: number;
  name: string;
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
