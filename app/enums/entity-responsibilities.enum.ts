export enum EntityPeopleType {
  'KEY ACCOUNT MANAGER' = 'KEY ACCOUNT MANAGER',
  'NATIONAL ACCOUNT MANAGER' = 'NATIONAL ACCOUNT MANAGER',
  'CHAIN DIRECTOR' = 'CHAIN DIRECTOR',
  'CHANNEL LEAD' = 'CHANNEL LEAD',
  'CORPORATE' = 'CORPORATE',
  'GENERAL MANAGER' = 'GENERAL MANAGER',
  'MARKET DEVELOPMENT MANAGER' = 'MARKET DEVELOPMENT MANAGER',
  'ON PREM ACTIVATION MANAGER' = 'ON PREM ACTIVATION MANAGER',
  'ON PREM ACTIVATION SPECIALIST' = 'ON PREM ACTIVATION SPECIALIST',
  'ON PREM DIRECTOR' = 'ON PREM DIRECTOR',
  'ON PREM MANAGER' = 'ON PREM MANAGER',
  'ON PREM VICE PRESIDENT' = 'ON PREM VICE PRESIDENT',
  'SALES LEADERSHIP' = 'SALES LEADERSHIP',
  'TEAM LEAD' = 'TEAM LEAD',
  'OFF PREMISE SPECIALIST' = 'OFF PREMISE SPECIALIST',
  'DRAFT' = 'DRAFT',
  'DRAFT MANAGER' = 'DRAFT MANAGER',
  'DISTRIBUTOR' = 'DISTRIBUTOR',
  'ACCOUNT' = 'ACCOUNT',
  'GEOGRAPHY' = 'GEOGRAPHY',
  'BRAND MARKET MANAGER' = 'BRAND MARKET MANAGER'
}

export enum EntityType {
  Person = 'Person',
  RoleGroup = 'RoleGroup',
  ResponsibilitiesGroup = 'ResponsibilitiesGroup',
  Distributor = 'Distributor',
  DistributorGroup = 'DistributorGroup',
  Account = 'Account',
  AccountGroup = 'AccountGroup',
  SubAccount = 'SubAccount'
}

export enum HierarchyGroupTypeCode {
  accounts = 'account',
  distributors = 'distributor'
}
