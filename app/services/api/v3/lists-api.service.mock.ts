import { Observable } from 'rxjs';
import { V3List } from '../../../models/lists/lists.model';
import { getV3ListMock } from '../../../models/lists/lists.model.mock';
import { generateRandomSizedArray } from '../../../models/util.model';

export const listApiServiceMock = {
  getLists: getLists,
  addOpportunitiesToList: addOpportunitiesToList,
  createList: createList
};

function getLists(): Observable<V3List[]> {
  const v3ListsCollection = generateRandomSizedArray(1, 20).map(() => getV3ListMock());
  return Observable.of(v3ListsCollection);
}

function addOpportunitiesToList(...args: any[]): Observable<any> {
  return Observable.of({});
}

function createList(): Observable<any> {
  return Observable.of(getV3ListMock());
}
