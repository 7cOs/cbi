import { Action } from '@ngrx/store';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';

export const SET_SALES_HIERARCHY_VIEW_TYPE = '[View Types] SET_SALES_HIERARCHY_VIEW_TYPE';
export class SetSalesHierarchyViewType implements Action {
  readonly type = SET_SALES_HIERARCHY_VIEW_TYPE;

  constructor(public payload: SalesHierarchyViewType) { }
}

export type Action = SetSalesHierarchyViewType;
