import { BaseList } from './base-list.model';
import { CollaboratorType } from '../../enums/lists/collaborator-type.enum';
import { ListCategory } from '../../enums/lists/list-category.enum';

export interface V3List extends BaseList {
  category: ListCategory;
  collaboratorType: CollaboratorType;
}
