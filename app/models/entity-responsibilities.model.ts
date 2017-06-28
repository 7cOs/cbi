export interface EntityResponsibilities {
  peopleType?: EntityPeopleType;
  propertyType?: EntityPropertyType;
  id: string;
  name: string;
}

export enum EntityPeopleType {
  MDM = <any>'MDM',
  Specialist = <any>'Specialist'
}

export enum EntityPropertyType {
  Distributor = <any>'Distributor',
  Account = <any>'Account'
}
