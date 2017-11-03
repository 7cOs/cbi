import { SalesHierarchyHeaderEntityType } from './team-performance-table-header.enum';

export enum SalesHierarchyViewType {
  roleGroups = 'roleGroups',
  people = 'people',
  distributors = 'distributors',
  accounts = 'accounts',
  subAccounts = 'subAccounts'
}

export namespace SalesHierarchyViewType {
  export function getSingularLabel(viewType: SalesHierarchyViewType) {
    switch (viewType) {
      case SalesHierarchyViewType.roleGroups:
        return SalesHierarchyHeaderEntityType.Group;
      case SalesHierarchyViewType.people:
        return SalesHierarchyHeaderEntityType.Person;
      case SalesHierarchyViewType.distributors:
        return SalesHierarchyHeaderEntityType.Distributor;
      case SalesHierarchyViewType.accounts:
        return SalesHierarchyHeaderEntityType.Account;
      case SalesHierarchyViewType.subAccounts:
        return SalesHierarchyHeaderEntityType.SubAccount;
      default:
        throw new Error(`SalesHierarchyViewType of ${ viewType } does not exist!`);
    }
  }
}
