export interface EntityResponsibilities {
  peopleType?: EntityPeopleType;
  propertyType?: EntityPropertyType;
  id: number;
  name: string;
}

// this needs to be updated to accommodate all types
export enum EntityPeopleType {
  MDM = <any>'MDM',
  Specialist = <any>'Specialist'
}

// this needs to be updated to accommodate all types
export enum EntityPropertyType {
  Distributor = <any>'Distributor',
  Account = <any>'Account'
}
