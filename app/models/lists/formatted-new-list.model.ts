import { ListCategory } from '../../enums/lists/list-category.enum';
import { ListType } from '../../enums/lists/list-type.enum';
import { CollaboratorType } from '../../enums/lists/collaborator-type.enum';

export interface FormattedNewList {
  category: ListCategory;
  collaboratorType: CollaboratorType;
  name: string;
  type: ListType;

  description?: string;
  ownerEmployeeId?: string;
  surveySfid?: any;
  archived?: boolean;
  collaboratorEmployeeIds?: string[];
}
