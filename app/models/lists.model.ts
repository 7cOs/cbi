export interface StoreDetailsRow {
  address: string;
  city: string;
}

export interface StoreHeaderDetails {
  description: string;
  id: number;
  name: string;
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
