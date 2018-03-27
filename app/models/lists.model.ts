export interface StoreDetailsRow {
  address: string;
  city: string;
  name: string;
  number: string;
  postalCode: string;
  premiseType: string;
  state: string;
}

export interface StoreHeaderDetails {
  description: string;
  id: number;
  name: string;
  collaborators: Array<Collaborators>;
  createdOn: string;
  numberOfAccounts: number;
  ownerFirstName: string;
  ownerLastName: string;
  updatedOn: string;
}

export interface Owner {
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface Collaborators {
  name: string;
}

export interface Survey {
  sfid: string;
  name: string;
}
